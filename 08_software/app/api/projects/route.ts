import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/logs'; // changed code - correct import path
import { ProjectStatus } from '@prisma/client';

// GET /api/projects - Fetch all projects
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as ProjectStatus | null;

    const where = status ? { status } : { status: { not: ProjectStatus.deleted } };

    const projects = await prisma.project.findMany({
      where,
      include: {
        _count: {
          select: { sessions: true }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });

    return NextResponse.json({ projects });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

// POST /api/projects - Create new project
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description } = body;

    if (!name || name.trim() === '') {
      return NextResponse.json(
        { error: 'Project name is required' },
        { status: 400 }
      );
    }

    const project = await prisma.project.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        status: 'active'
      }
    });

    return NextResponse.json({ project }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating project:', error);
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Project name already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}