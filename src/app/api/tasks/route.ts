import { NextRequest, NextResponse } from 'next/server';
import tasksData from '@/data/tasks.json';
import type { Task, ApiResponse } from '@/types/index';

let tasks: Task[] = tasksData as Task[];

export async function GET(_request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      data: tasks,
    } as ApiResponse<Task[]>);
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newTask: Task = {
      ...body,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    tasks.push(newTask);
    return NextResponse.json(
      { success: true, data: newTask },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to create task' },
      { status: 500 }
    );
  }
}
