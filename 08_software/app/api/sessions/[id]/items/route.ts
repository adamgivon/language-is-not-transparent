// >>> BEGIN FILE: api/sessions/[id]/items/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/logs";

// GET /api/sessions/[id]/items → return all items for a session
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const items = await prisma.item.findMany({
      where: { sessionId: id },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ items });
  } catch (err: any) {
    console.error("Error fetching items:", err);
    return NextResponse.json(
      { error: "Failed to fetch session items" },
      { status: 500 }
    );
  }
}
// >>> END FILE: api/sessions/[id]/items/route.ts
