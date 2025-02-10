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
      let animeList: any[] = [];
      let nextPageUrl:
        | string
        | null = `${MAL_API_URL}/users/@me/animelist?limit=100&fields=list_status,alternative_titles&status=${status}`;

      while (nextPageUrl) {
        const response = await fetch(nextPageUrl, {
          headers: { Authorization: MAL_ACCESS_TOKEN }, // Fix Bearer token issue
        });

        if (!response.ok)
          throw new Error(
            `Failed to fetch ${status} anime: ${response.statusText}`
          );

        const data = await response.json();
        animeList.push(...(data.data || [])); // Add fetched anime to the list
        nextPageUrl = data.paging?.next || null; // Get next page URL if available
      }

      allAnime[status] = animeList; // Store all fetched anime under the respective status
    }

    return NextResponse.json(allAnime);
  } catch (error: any) {
    console.error('Error fetching anime list:', error);
    return NextResponse.json(
      { error: error?.message || 'An error occurred' },
      { status: 500 }
    );
  }
}
