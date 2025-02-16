import { MAL_API_URL, MAL_CLIENT_ID, MAL_REDIRECT_URI } from '@/constants';
import { getValidAccessToken } from '@/utils/tokenUtils';
import { NextRequest, NextResponse } from 'next/server';

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
      `${MAL_API_URL}/users/@me?fields=anime_statistics`,
      {
        headers,
        cache: 'no-store',
      }
    );

    if (!response.ok)
      throw new Error(
        `Failed to fetch anime statistics: ${response.statusText}`
      );

    const data = await response.json();
    return NextResponse.json(data.anime_statistics);
  } catch (error: any) {
    console.error('Error fetching anime statistics:', error);
    return NextResponse.json(
      { error: error?.message || 'An error occurred' },
      { status: 500 }
    );
  }
}
