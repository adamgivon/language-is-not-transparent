import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/logs";
import OpenAI from "openai";
// import { removeVectors } from "@/services/mcp/vector"; // Disabled: vectorIds may be shared across sessions

// GET /api/sessions/[id] - Fetch single session
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const session = await prisma.session.findUnique({
      where: { id },
      include: {
        project: {
          select: {
            name: true,
          },
        },
        items: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    return NextResponse.json(session);
  } catch (error) {
    console.error("Error fetching session:", error);
    return NextResponse.json(
      { error: "Failed to fetch session" },
      { status: 500 }
    );
  }
}

// PATCH /api/sessions/[id] - Update session (rename or notes)  //changed - updated comment
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, notes } = body; //new - also accept notes

    //new - validate: at least one field must be provided
    if (name === undefined && notes === undefined) {
      return NextResponse.json(
        { error: "Either name or notes must be provided" },
        { status: 400 }
      );
    }

    //new - validate name if provided
    if (name !== undefined && name.trim() === "") {
      return NextResponse.json(
        { error: "Session name cannot be empty" },
        { status: 400 }
      );
    }

    const newName = name !== undefined ? name.trim() : undefined; //changed - only process if provided

    // Use transaction to update session and all related denormalized fields
    const session = await prisma.$transaction(async (tx) => {
      // Get old session first  //changed - updated comment
      const oldSession = await tx.session.findUnique({
        where: { id },
        select: { name: true },
      });

      if (!oldSession) {
        throw new Error("SESSION_NOT_FOUND");
      }

      const oldName = oldSession.name;

      //new - build update data dynamically
      const updateData: any = {};
      if (newName !== undefined) updateData.name = newName;
      if (notes !== undefined) updateData.notes = notes?.trim() || null;

      // Update session  //changed - can update name and/or notes
      const updatedSession = await tx.session.update({
        where: { id },
        data: updateData, //changed - use dynamic updateData
        include: {
          project: {
            select: {
              name: true,
            },
          },
        },
      });

      // Update denormalized sessionName in related tables
      // Only update if name actually changed
      if (oldName !== newName) {
        await Promise.all([
          // Update Item table
          tx.item.updateMany({
            where: { sessionId: id },
            data: { sessionName: newName },
          }),
          // Update ItemAnchor table (via Item relation)
          tx.itemAnchor.updateMany({
            where: {
              item: { sessionId: id },
            },
            data: { sessionName: newName },
          }),
          // Update RequestSnapshot table
          tx.requestSnapshot.updateMany({
            where: { sessionId: id },
            data: { sessionName: newName },
          }),
          // Update JudgeEvaluation table (if exists)
          tx.judgeEvaluation.updateMany({
            where: { sessionName: oldName },
            data: { sessionName: newName },
          }),
        ]);
      }

      return updatedSession;
    });

    return NextResponse.json(session);
  } catch (error: any) {
    console.error("Error updating session:", error);

    if (error.message === "SESSION_NOT_FOUND" || error.code === "P2025") {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "A session with this name already exists in this project" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update session" },
      { status: 500 }
    );
  }
}

// DELETE /api/sessions/[id] - Hard delete: OpenAI + FAISS + DB
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Load session with project + item vector ids
    const s = await prisma.session.findUnique({
      where: { id },
      select: {
        id: true,
        conversationId: true,
        projectId: true,
        project: { select: { promptIndexId: true, responseIndexId: true } },
        items: { select: { promptVectorId: true, responseVectorId: true } },
      },
    });

    if (!s) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Best-effort delete OpenAI conversation - unchanged logic
    if (s.conversationId) {
      try {
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        // @ts-ignore
        await openai.conversations.delete(s.conversationId);
      } catch (e) {
        console.warn("OpenAI conversation delete failed:", e);
      }
    }

    // DISABLED: vectorIds are content-hashed (sha256) and may be shared across sessions.
    // Deleting them would corrupt other sessions. Orphans can be cleaned separately.
    //
    // // Remove FAISS vectors for this session (project-level indexes)
    // try {
    //   const promptVids = s.items
    //     .map((i) => i.promptVectorId)
    //     .filter(Boolean) as string[];
    //   const responseVids = s.items
    //     .map((i) => i.responseVectorId)
    //     .filter(Boolean) as string[];
    //
    //   if (s.project?.promptIndexId && promptVids.length) {
    //     await removeVectors(
    //       s.projectId,
    //       s.project.promptIndexId,
    //       "prompts",
    //       promptVids
    //     );
    //   }
    //   if (s.project?.responseIndexId && responseVids.length) {
    //     await removeVectors(
    //       s.projectId,
    //       s.project.responseIndexId,
    //       "responses",
    //       responseVids
    //     );
    //   }
    // } catch (e) {
    //   console.warn("FAISS cleanup failed (continuing with DB delete):", e);
    // }

    // DB delete (cascades to Items/ItemAnchors/RequestSnapshots)        // unchanged
    await prisma.session.delete({ where: { id } });

    return NextResponse.json({
      message: "Session hard-deleted: OpenAI + FAISS + DB cleaned.",
    });
  } catch (error: any) {
    console.error("Error deleting session:", error);

    if (error.code === "P2025") {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Failed to delete session" },
      { status: 500 }
    );
  }
}
