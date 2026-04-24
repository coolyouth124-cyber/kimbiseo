import { NextRequest, NextResponse } from 'next/server';
import usersData from '@/data/users.json';
import type { User, ApiResponse } from '@/types/index';

let users: User[] = usersData as User[];

export async function GET(_request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      data: users,
    } as ApiResponse<User[]>);
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
