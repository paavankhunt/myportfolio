import { MAL_API_URL, MAL_CLIENT_ID, MAL_REDIRECT_URI } from '@/constants';
import { getValidAccessToken } from '@/utils/tokenUtils';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
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

    const res = await fetch(
      `${MAL_API_URL}/manga/${params.id}?fields=id,title,main_picture,alternative_titles,start_date,end_date,synopsis,mean,rank,popularity,num_list_users,num_scoring_users,nsfw,created_at,updated_at,media_type,status,genres,my_list_status,num_volumes,num_chapters,authors,serialization,pictures,background,related_anime,related_manga,recommendations,statistics`,
      {
        headers,
        cache: 'no-store',
      }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch manga data' },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
