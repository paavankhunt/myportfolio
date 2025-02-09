import { MAL_ACCESS_TOKEN, MAL_API_URL } from '@/constants';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const response = await fetch(
      `${MAL_API_URL}/users/@me/animelist?limit=1000`,
      {
        headers: { Authorization: MAL_ACCESS_TOKEN },
      }
    );

    if (!response.ok) throw new Error('Failed to fetch anime list');

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
