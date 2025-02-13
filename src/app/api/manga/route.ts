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
      'reading',
      'completed',
      'on_hold',
      'dropped',
      'plan_to_read',
    ];
    let allManga: Record<string, any[]> = {};

    for (const status of statuses) {
      let mangaList: any[] = [];
      let nextPageUrl = `${MAL_API_URL}/users/@me/mangalist?limit=1000&fields=list_status,alternative_titles&status=${status}`;

      while (nextPageUrl) {
        const response = await fetch(nextPageUrl, { headers });

        if (!response.ok) {
          throw new Error(
            `Failed to fetch ${status} manga: ${response.statusText}`
          );
        }

        const data = await response.json();
        mangaList.push(...(data.data || []));
        nextPageUrl = data.paging?.next || null;
      }

      allManga[status] = mangaList;
    }

    return new NextResponse(JSON.stringify(allManga), { headers });
  } catch (error: any) {
    console.error('Error fetching manga list:', error);
    return NextResponse.json(
      { error: error?.message || 'An error occurred' },
      { status: 500 }
    );
  }
}
