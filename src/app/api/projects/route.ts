import { NextRequest, NextResponse } from 'next/server';
import projectsData from '@/data/projects.json';
import type { Project, ApiResponse } from '@/types/index';

let projects: Project[] = projectsData as Project[];

export async function GET(_request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      data: projects,
    } as ApiResponse<Project[]>);
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}
