import { NextRequest, NextResponse } from "next/server";
  import { prisma } from "@/lib/db/logs";
  import { getDefaultAnchoringConfig } from "@/lib/anchoring/defaults";
  import type { AnchoringConfig } from "@/types/anchoring_config";

  // GET /api/sessions/[id]/config
  // Fetch session's anchoring config
  export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) {
    try {
      const { id } = await params;

      const session = await prisma.session.findUnique({
        where: { id },
        select: {
          anchoringConfig: true,
          project: {
            select: {
              defaultAnchoringConfig: true,
              anchorCount: true,
            }
          }
        },
      });

      if (!session) {
        return NextResponse.json(
          { error: "Session not found" },
          { status: 404 }
        );
      }

      // Return session config if exists, otherwise project default, otherwise generate default
      const config = session.anchoringConfig ||
                     session.project?.defaultAnchoringConfig ||
                     getDefaultAnchoringConfig(session.project?.anchorCount || 19);

      return NextResponse.json(config);
    } catch (error) {
      console.error("Error fetching session config:", error);
      return NextResponse.json(
        { error: "Failed to fetch config" },
        { status: 500 }
      );
    }
  }

  // POST /api/sessions/[id]/config
  // Create/update session config
  export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) {
    try {
      const { id } = await params;
      const config = await request.json() as AnchoringConfig;

      // Update session with new config
      const session = await prisma.session.update({
        where: { id },
        data: { anchoringConfig: config },
      });

      return NextResponse.json({ success: true, config });
    } catch (error) {
      console.error("Error saving session config:", error);
      return NextResponse.json(
        { error: "Failed to save config" },
        { status: 500 }
      );
    }
  }
