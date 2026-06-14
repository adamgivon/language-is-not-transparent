import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/logs";
import { ProjectStatus } from "@prisma/client";

// GET /api/projects/[id] - Fetch single project
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // changed code - params is now Promise
) {
  try {
    const { id } = await params; // new code - await params first

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        sessions: {
          orderBy: { updatedAt: "desc" },
        },
        _count: {
          select: { sessions: true },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Fetch anchorSystem separately
    let anchorSystem = null;
    if (project.anchorSystemId) {
      anchorSystem = await prisma.anchorSystem.findUnique({
        where: { id: project.anchorSystemId },
      });
    }

    return NextResponse.json({ project: { ...project, anchorSystem } });
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json(
      { error: "Failed to fetch project" },
      { status: 500 }
    );
  }
}

// PATCH /api/projects/[id] - Update project (status, name, description)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // changed code - params is now Promise
) {
  try {
    const { id } = await params; // new code - await params first
    const body = await request.json();
    const { status, name, description } = body;

    // Validate status if provided
    if (status && !["active", "archived", "deleted"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status value" },
        { status: 400 }
      );
    }

    // Build update data
    const updateData: any = {};
    if (status !== undefined) updateData.status = status as ProjectStatus;
    if (name !== undefined) updateData.name = name.trim();
    if (description !== undefined)
      updateData.description = description?.trim() || null;

    const project = await prisma.project.update({
      where: { id }, // changed code - use destructured id
      data: updateData,
    });

    return NextResponse.json({ project });
  } catch (error: any) {
    console.error("Error updating project:", error);

    // Handle not found
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Handle unique constraint violation
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Project name already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 }
    );
  }
}

// DELETE /api/projects/[id] - Hard delete project
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if project has sessions
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        _count: {
          select: { sessions: true },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (project._count.sessions > 0) {
      return NextResponse.json(
        {
          error:
            "Cannot delete project with existing sessions. Archive instead.",
        },
        { status: 400 }
      );
    }

    // Delete from database first
    await prisma.project.delete({
      where: { id },
    });

    // Clean up FAISS directory if it exists
    try {
      const { deleteProjectFaissDir } = await import("@/services/mcp/vector");
      await deleteProjectFaissDir(id);
      console.log(`Cleaned up FAISS directory for project ${id}`);
    } catch (fsError: any) {
      // Log but don't fail the deletion if FAISS cleanup fails
      console.warn(
        `Failed to clean up FAISS directory for project ${id}:`,
        fsError.message
      );
    }

    return NextResponse.json({ message: "Project deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting project:", error);

    if (error.code === "P2025") {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
}
