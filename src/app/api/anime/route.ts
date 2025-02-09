import { MAL_ACCESS_TOKEN, MAL_API_URL } from '@/constants';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const statuses = [
      'watching',
      'completed',
      'on_hold',
      'dropped',
      'plan_to_watch',
    ];
    let allAnime: Record<string, any[]> = {};

    for (const status of statuses) {
      const response = await fetch(
        `${MAL_API_URL}/users/@me/animelist?limit=1000&fields=list_status&status=${status}`,
        {
          headers: { Authorization: MAL_ACCESS_TOKEN }, // Fix missing "Bearer"
        }
      );

      if (!response.ok)
        throw new Error(
          `Failed to fetch ${status} anime: ${response.statusText}`
        );

      const data = await response.json();
      allAnime[status] = data.data || []; // Store results by status
    }

    return NextResponse.json(allAnime); // Return all anime categorized by status
  } catch (error: any) {
    console.error('Error fetching anime list:', error);
    return NextResponse.json(
      { error: error?.message || 'An error occurred' },
      { status: 500 }
    );
  }
}
