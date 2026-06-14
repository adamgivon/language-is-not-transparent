import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/logs";
import * as fs from "fs/promises";
import * as path from "path";

// POST /api/projects/[id]/initialize
// Initialize FAISS indexes for a project
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params;
    const body = await request.json();
    const { useExistingAnchors = true, anchorSystemName, chunksPath } = body;

    // Get the project
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    let anchorSystem: any;
    let anchorIndexId: string;
    let shouldUpdateAnchors = false; // NEW: flag to control AnchorChunk updates

    const { resetIndex } = await import("@/services/mcp/vector");

    if (useExistingAnchors) {
      // Use existing anchor system
      if (!anchorSystemName) {
        anchorSystem = await prisma.anchorSystem.findFirst({
          orderBy: { createdAt: "asc" },
        });

        if (!anchorSystem) {
          return NextResponse.json(
            { error: "No anchor systems available. Please create one first." },
            { status: 400 }
          );
        }
      } else {
        anchorSystem = await prisma.anchorSystem.findUnique({
          where: { name: anchorSystemName },
        });

        if (!anchorSystem) {
          return NextResponse.json(
            { error: `Anchor system '${anchorSystemName}' not found` },
            { status: 404 }
          );
        }
      }

      // ✅ Always create project-specific anchor index
      anchorIndexId = await resetIndex(projectId, "anchors");

      // ✅ Check if AnchorChunks already exist for this system
      const existingChunks = await prisma.anchorChunk.findMany({
        where: { version: anchorSystem.name },
        take: 1,
      });

      shouldUpdateAnchors = existingChunks.length === 0;

      if (shouldUpdateAnchors) {
        console.log(
          `No existing chunks found for ${anchorSystem.name}, will create AnchorChunks`
        );
      } else {
        console.log(
          `AnchorChunks already exist for ${anchorSystem.name}, skipping database updates`
        );
      }

      // Seed anchors from the system's chunksPath
      const vectorIdMapping = await seedAnchorsFromChunksPath(
        projectId,
        anchorIndexId,
        anchorSystem.chunksPath,
        anchorSystem.name,
        shouldUpdateAnchors
      );

     } else {
      // Create new anchor system
      if (!chunksPath) {
        return NextResponse.json(
          { error: "chunksPath is required when creating new anchor system" },
          { status: 400 }
        );
      }

      // Normalize path for comparison
      const normalizedPath = path.resolve(chunksPath);

      // ✅ Check if this path already exists in another AnchorSystem
      const existingSystem = await prisma.anchorSystem.findFirst({
        where: { chunksPath: normalizedPath },
      });

      if (existingSystem) {
        // Path already exists - reuse the system
        console.log(
          `Chunks path already exists in system: ${existingSystem.name}`
        );
        anchorSystem = existingSystem;
        shouldUpdateAnchors = false; // Don't update existing chunks
      } else {
        // New path - create new system
        const files = await fs.readdir(normalizedPath);
        const jsonFiles = files.filter((f) => f.endsWith(".json"));
        const anchorCount = jsonFiles.length;

        if (anchorCount === 0) {
          return NextResponse.json(
            { error: "No JSON anchor files found in the specified path" },
            { status: 400 }
          );
        }

        // Read first chunk to get version
        const firstChunkPath = path.join(normalizedPath, jsonFiles[0]);
        const firstChunkContent = await fs.readFile(firstChunkPath, "utf-8");
        const firstChunk = JSON.parse(firstChunkContent);

        if (!firstChunk.version) {
          return NextResponse.json(
            { error: 'Chunk files must have a "version" field' },
            { status: 400 }
          );
        }

        const systemName = firstChunk.version; // ✅ Use version from chunks

        // Create new anchor system record
        anchorSystem = await prisma.anchorSystem.create({
          data: {
            name: systemName,
            anchorCount,
            chunksPath: normalizedPath,
            embeddingDim: 3072,
            embeddingModel: "text-embedding-3-large",
            description: `Anchor system from ${normalizedPath} with ${anchorCount} anchors`,
          },
        });

        console.log(`Created new anchor system: ${systemName}`);
        shouldUpdateAnchors = true; // New system needs chunks created
      }

      // Create project-specific anchor index
      anchorIndexId = await resetIndex(projectId, "anchors");

      // Seed the anchor system
      const vectorIdMapping = await seedAnchorsFromChunksPath(
        projectId,
        anchorIndexId,
        anchorSystem.chunksPath,
        anchorSystem.name,
        shouldUpdateAnchors
      );
    }

    // Initialize project-level prompt and response indexes
    const promptIndexId = await resetIndex(projectId, "prompts");
    const responseIndexId = await resetIndex(projectId, "responses");

    // Update project with index references
    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: {
        anchorSystemId: anchorSystem.id,
        anchorCount: anchorSystem.anchorCount,
        anchorChunksPath: anchorSystem.chunksPath,
        anchorIndexId: anchorIndexId,
        promptIndexId: promptIndexId,
        responseIndexId: responseIndexId,
      },
    });

    return NextResponse.json({
      project: updatedProject,
      anchorSystem: {
        name: anchorSystem.name,
        anchorCount: anchorSystem.anchorCount,
        chunksPath: anchorSystem.chunksPath,
      },
      message: "Project indexes initialized successfully",
    });
  } catch (error: any) {
    console.error("Error initializing project indexes:", error);
    return NextResponse.json(
      { error: error.message || "Failed to initialize project" },
      { status: 500 }
    );
  }
}

// GET /api/projects/[id]/initialize
// Check initialization status and available anchor systems
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params;

    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Get available anchor systems
    const anchorSystems = await prisma.anchorSystem.findMany({
      orderBy: { createdAt: "desc" },
    });

    const isInitialized = !!(
      project.anchorIndexId &&
      project.promptIndexId &&
      project.responseIndexId
    );

    return NextResponse.json({
      isInitialized,
      project: {
        anchorCount: project.anchorCount,
        anchorChunksPath: project.anchorChunksPath,
        anchorSystemId: project.anchorSystemId,
      },
      availableAnchorSystems: anchorSystems.map((system) => ({
        name: system.name,
        anchorCount: system.anchorCount,
        chunksPath: system.chunksPath,
      })),
    });
  } catch (error: any) {
    console.error("Error checking project initialization:", error);
    return NextResponse.json(
      { error: error.message || "Failed to check initialization status" },
      { status: 500 }
    );
  }
}

// ===== HELPER FUNCTIONS =====

/**
 * Seeds anchors from a chunks directory path
 * @param shouldUpdateDatabase - If false, only indexes in FAISS (skips AnchorChunk upserts)
 * @returns Mapping of anchor names to FAISS vectorIds
 */
async function seedAnchorsFromChunksPath(
  projectId: string,
  anchorIndexId: string,
  chunksPath: string,
  systemName: string,
  shouldUpdateDatabase: boolean
): Promise<Record<string, string>> {
  const { getMCPVector } = await import("@/services/mcp/vector");
  const vecSvc = await getMCPVector();

  const files = await fs.readdir(chunksPath);
  const jsonFiles = files.filter((f) => f.endsWith(".json")).sort();

  if (jsonFiles.length === 0) {
    throw new Error(`No JSON anchor files found in ${chunksPath}`);
  }

  console.log(
    `Seeding ${jsonFiles.length} anchors for project ${projectId} from ${chunksPath}`
  );
  console.log(
    `Database updates: ${shouldUpdateDatabase ? "ENABLED" : "DISABLED"}`
  );

  const vectorIdMapping: Record<string, string> = {};

  for (let i = 0; i < jsonFiles.length; i++) {
    const file = jsonFiles[i];
    const filePath = path.join(chunksPath, file);
    const content = await fs.readFile(filePath, "utf-8");
    const chunk = JSON.parse(content);

    // Validate chunk structure
    if (
      !chunk.id ||
      !chunk.version ||
      !chunk.name ||
      !chunk.text ||
      chunk.text.trim() === ""
    ) {
      throw new Error(`Invalid or empty chunk in file ${file}`);
    }

    // Embed the anchor text
    const embedding = await vecSvc.embed(chunk.text);

    // ✅ Conditionally upsert AnchorChunk to database
    if (shouldUpdateDatabase) {
      await prisma.anchorChunk.upsert({
        where: {
          version_name: {
            version: chunk.version, // ✅ Use version from chunk JSON
            name: chunk.name,
          },
        },
        create: {
          version: chunk.version, // ✅ Store original version from JSON
          order: chunk.order ?? i,
          name: chunk.name,
          text: chunk.text,
          vectorId: embedding.vectorId,
          meta: chunk.meta || null,
        },
        update: {
          text: chunk.text,
          vectorId: embedding.vectorId,
          order: chunk.order ?? i,
          meta: chunk.meta || null,
        },
      });
    }

    // ✅ Always index in FAISS (project-specific)
    await vecSvc.index(
      projectId,
      anchorIndexId,
      "anchors",
      embedding.vectorId,
      embedding.vector,
      { anchorChunkId: chunk.id, anchorName: chunk.name }
    );

    // Store mapping
    vectorIdMapping[chunk.name] = embedding.vectorId;

    console.log(`  ✅ Seeded: [${i}] ${chunk.name}`);
  }

  console.log(`Successfully seeded ${jsonFiles.length} anchors`);
  return vectorIdMapping;
}
