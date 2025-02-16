import { NextRequest, NextResponse } from 'next/server';
import { getValidAccessToken } from '@/utils/tokenUtils';

const MAL_API_URL = 'https://api.myanimelist.net/v2';

export async function GET(req: NextRequest) {
  try {
    let accessToken = await getValidAccessToken();

    if (!accessToken) {
      throw new Error('❌ Access token retrieval failed.');
    }

    const headers = new Headers({
      Authorization: accessToken as string,
      'Cache-Control': 'no-store',
    });

    const response = await fetch(
      `${MAL_API_URL}/users/@me/animelist?limit=1000&fields=list_status`,
      { headers }
    );

    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(`Failed to fetch anime list: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'An error occurred' },
      { status: 500 }
    );
  }
}
