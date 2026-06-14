// >>> BEGIN FILE: api/sessions/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { prisma } from "@/lib/db/logs";

// GET /api/sessions?projectId=xxx → list sessions for a project
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get("projectId");

  if (!projectId) {
    return NextResponse.json({ error: "Missing projectId" }, { status: 400 });
  }

  try {
    const sessions = await prisma.session.findMany({
      where: { projectId },
      include: {
        // new code - include project relation
        project: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(sessions);
  } catch (err: any) {
    console.error("Error fetching sessions:", err);
    return NextResponse.json(
      { error: "Failed to fetch sessions" },
      { status: 500 }
    );
  }
}

// POST /api/sessions → create a new session with OpenAI conversation
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { projectId, name: requestedName, anchoringConfig } = body;

    if (!projectId || !requestedName) {
      return NextResponse.json(
        { error: "Missing projectId or name" },
        { status: 400 }
      );
    }

    // Check if project is initialized - new code
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: {
        anchorIndexId: true,
        promptIndexId: true,
        responseIndexId: true,
        name: true,
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (
      !project.anchorIndexId ||
      !project.promptIndexId ||
      !project.responseIndexId
    ) {
      // new code
      return NextResponse.json(
        { error: "Project not initialized. Please initialize indexes first." },
        { status: 400 }
      );
    }

    // Ensure a unique name within the project ------------------------------- new code
    const base = requestedName.trim(); // new code
    const existing = await prisma.session.findMany({
      // new code
      where: { projectId, name: { startsWith: base } }, // new code
      select: { name: true }, // new code
    }); // new code
    const existingNames = new Set(existing.map((e) => e.name)); // new code
    let uniqueName = base; // new code
    if (existingNames.has(base)) {
      // new code
      let i = 2; // new code
      while (existingNames.has(`${base} (${i})`) && i < 1000) i++; // new code
      uniqueName = `${base} (${i})`; // new code
    } // new code
    // ---------------------------------------------------------------------- new code

    // 1. Create OpenAI Conversation
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const conversation = await openai.conversations.create({
      metadata: { projectId, sessionName: uniqueName },
    });

    // 2. NO index creation - use project's indexes - changed code
    // Removed resetIndex() calls

    // 3. Create Session in DB - references project indexes - changed code
    // new code - check if this is the first session (to set project default)
    const existingSessionCount = await prisma.session.count({
      where: { projectId },
    });
    const isFirstSession = existingSessionCount === 0;

    // new code - if first session and project has no default, set it
    if (isFirstSession && anchoringConfig) {
      await prisma.project.update({
        where: { id: projectId },
        data: { defaultAnchoringConfig: anchoringConfig },
      });
    }

    // 3. Create Session in DB - references project indexes - changed code
    const session = await prisma.session.create({
      data: {
        projectId,
        projectName: project.name,
        name: uniqueName,
        conversationId: conversation.id,
        anchoringConfig, // new code - save config to session
        // Removed index fields - sessions now use project-level indexes
        embeddingContext: {
          model: "text-embedding-3-large",
          dim: 3072,
        },
      },

      include: {
        project: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json(session, { status: 201 });
  } catch (err: any) {
    console.error("Error creating session:", err);
    return NextResponse.json(
      { error: err.message || "Failed to create session" },
      { status: 500 }
    );
  }
}
