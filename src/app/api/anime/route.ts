import { MAL_ACCESS_TOKEN, MAL_API_URL } from '@/constants';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const headers = new Headers({
      Authorization: MAL_ACCESS_TOKEN,
      'Cache-Control': 'no-store', // 🔥 Prevent caching
      Pragma: 'no-cache',
      Expires: '0',
    });

    const statuses = [
      'watching',
      'completed',
      'on_hold',
      'dropped',
      'plan_to_watch',
    ];
    let allAnime: Record<string, any[]> = {};

    for (const status of statuses) {
      let animeList: any[] = [];
      let nextPageUrl = `${MAL_API_URL}/users/@me/animelist?limit=1000&fields=list_status,alternative_titles&status=${status}`;

      while (nextPageUrl) {
        const response = await fetch(nextPageUrl, { headers });

        if (!response.ok) {
          throw new Error(
            `Failed to fetch ${status} anime: ${response.statusText}`
          );
        }

        const data = await response.json();
        animeList.push(...(data.data || []));
        nextPageUrl = data.paging?.next || null;
      }

      allAnime[status] = animeList;
    }

    return new NextResponse(JSON.stringify(allAnime), { headers });
  } catch (error: any) {
    console.error('Error fetching anime list:', error);
    return NextResponse.json(
      { error: error?.message || 'An error occurred' },
      { status: 500 }
    );
  }
}
