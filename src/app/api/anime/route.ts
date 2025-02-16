import { NextRequest, NextResponse } from 'next/server';
import { getValidAccessToken } from '@/utils/tokenUtils';
import { AnimeListResponse } from '@/types/anime';
import { MAL_API_URL, MAL_CLIENT_ID, MAL_REDIRECT_URI } from '@/constants';

function groupAnimeByStatus(animeList: AnimeListResponse['data']) {
  const categorizedAnime: Record<string, AnimeListResponse['data']> = {};

  animeList.forEach((anime) => {
    const status = anime.list_status?.status || 'unknown';
    if (!categorizedAnime[status]) {
      categorizedAnime[status] = [];
    }
    categorizedAnime[status].push(anime);
  });

  return categorizedAnime;
}

export async function GET(req: NextRequest) {
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

    const response = await fetch(
      `${MAL_API_URL}/users/@me/animelist?limit=1000&fields=list_status,alternative_titles,status`,
      { headers, cache: 'no-store' }
    );

    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(`Failed to fetch anime list: ${response.statusText}`);
    }

    const data = await response.json();
    const categorizedAnime = groupAnimeByStatus(data?.data);

    return NextResponse.json(categorizedAnime);
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'An error occurred' },
      { status: 500 }
    );
  }
}
