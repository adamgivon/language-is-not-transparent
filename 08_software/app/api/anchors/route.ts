import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/logs";

// GET /api/anchors?version=xxx → list anchor chunks for a version
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const version = searchParams.get("version");

  if (!version) {
    return NextResponse.json({ error: "Missing version" }, { status: 400 });
  }

  try {
    const chunks = await prisma.anchorChunk.findMany({
      where: { version },
      select: {
        id: true,
        name: true,
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(chunks);
  } catch (err: any) {
    console.error("Error fetching anchor chunks:", err);
    return NextResponse.json(
      { error: "Failed to fetch anchor chunks" },
      { status: 500 }
    );
  }
}
