import { NextRequest, NextResponse } from 'next/server';
import meetingsData from '@/data/meetings.json';
import type { Meeting, ApiResponse } from '@/types/index';

let meetings: Meeting[] = meetingsData as Meeting[];

export async function GET(_request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      data: meetings,
    } as ApiResponse<Meeting[]>);
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch meetings' },
      { status: 500 }
    );
  }
}
