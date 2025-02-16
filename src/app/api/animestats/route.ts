import { MAL_API_URL } from '@/constants';
import { getValidAccessToken } from '@/utils/tokenUtils';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    let accessToken = await getValidAccessToken();

    if (!accessToken) {
      throw new Error('❌ Access token retrieval failed.');
    }

    const response = await fetch(
      `${MAL_API_URL}/users/@me?fields=anime_statistics`,
      {
        headers: { Authorization: accessToken as string },
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
