import { NextRequest, NextResponse } from 'next/server';
  import { prisma } from '@/lib/db/logs';

  // GET /api/projects/initialize-info
  // Get available anchor systems (doesn't require a specific project)
  export async function GET(request: NextRequest) {
    try {
      const anchorSystems = await prisma.anchorSystem.findMany({
        orderBy: { createdAt: 'desc' }
      });

      return NextResponse.json({
        availableSystems: anchorSystems.map((system) => ({
          name: system.name,
          anchorCount: system.anchorCount,
          chunksPath: system.chunksPath
        }))
      });
    } catch (error: any) {
      console.error('Error fetching anchor systems:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to fetch anchor systems' },
        { status: 500 }
      );
    }
  }
