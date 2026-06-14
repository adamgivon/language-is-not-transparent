import { NextRequest, NextResponse } from "next/server";
  import { prisma } from "@/lib/db/logs";

  // GET /api/sessions/[id]/parameters - Fetch last-used parameters for a session
  export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) {
    try {
      const { id } = await params;

      // Get the most recent RequestSnapshot for this session
      const snapshot = await prisma.requestSnapshot.findFirst({
        where: { sessionId: id },
        orderBy: { createdAt: "desc" },
        select: {
          model: true,
          temperature: true,
          topP: true,
          maxOutputTokens: true,
          presencePenalty: true,
          frequencyPenalty: true,
          anchoredMode: true,
          reasoningEffort: true,
          meta: true,
        },
      });

      if (!snapshot) {
        return NextResponse.json(
          { error: "No parameters found for this session" },
          { status: 404 }
        );
      }

      // Extract parameters from snapshot and meta
      const meta = snapshot.meta as any || {};

      return NextResponse.json({
        model: snapshot.model,
        temperature: snapshot.temperature,
        topP: snapshot.topP,
        maxOutputTokens: snapshot.maxOutputTokens,
        presencePenalty: snapshot.presencePenalty,
        frequencyPenalty: snapshot.frequencyPenalty,
        mode: snapshot.anchoredMode || meta.mode || "anchored",
        store: meta.store ?? true,
        stream: meta.stream ?? false,
        reasoningEffort: snapshot.reasoningEffort,
      });
    } catch (error) {
      console.error("Error fetching session parameters:", error);
      return NextResponse.json(
        { error: "Failed to fetch session parameters" },
        { status: 500 }
      );
    }
  }
