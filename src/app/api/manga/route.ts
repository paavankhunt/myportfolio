import { MAL_API_URL, MAL_CLIENT_ID, MAL_REDIRECT_URI } from '@/constants';
import { getValidAccessToken } from '@/utils/tokenUtils';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Groups manga by list status
 */
function groupMangaByStatus(mangaList: any[]) {
  const groupedManga: Record<string, any[]> = {};

  mangaList.forEach((manga) => {
    const status = manga.list_status?.status || 'unknown';
    if (!groupedManga[status]) {
      groupedManga[status] = [];
    }
    groupedManga[status].push(manga);
  });

  return groupedManga;
}

export async function GET(req: Request) {
  try {
    let accessToken = await getValidAccessToken();

    if (!accessToken) {
      return NextResponse.redirect(
        `https://myanimelist.net/v1/oauth2/authorize?response_type=code&client_id=${MAL_CLIENT_ID}&redirect_uri=${encodeURIComponent(
          MAL_REDIRECT_URI
        )}&code_challenge=paavanpaavanpaavanpaavanpaavanpaavanpaavanpaavan&code_challenge_method=plain`
      );
    }

    const headers = new Headers({
      Authorization: accessToken,
      'Cache-Control': 'no-store',
      Pragma: 'no-cache',
      Expires: '0',
    });

    let allManga: any[] = [];
    let nextPageUrl = `${MAL_API_URL}/users/@me/mangalist?limit=1000&fields=list_status,alternative_titles`;

    // Fetch all manga (handle pagination)
    while (nextPageUrl) {
      const response = await fetch(nextPageUrl, { headers, cache: 'no-store' });

      if (!response.ok) {
        return NextResponse.json(
          { error: 'Failed to fetch manga list' },
          { status: response.status }
        );
      }

      const data = await response.json();
      allManga.push(...(data.data || []));
      nextPageUrl = data.paging?.next || null;
    }

    // Group manga by status
    const groupedManga = groupMangaByStatus(allManga);

    return NextResponse.json(groupedManga);
  } catch (error) {
    console.error('Error fetching manga list:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
