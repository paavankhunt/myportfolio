import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import {
  MAL_CLIENT_ID,
  MAL_CLIENT_SECRET,
  MAL_REDIRECT_URI,
} from '@/constants';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json(
      { error: 'Authorization code missing' },
      { status: 400 }
    );
  }

  try {
    // 🌍 Exchange the code for an access token
    const response = await fetch('https://myanimelist.net/v1/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: MAL_CLIENT_ID,
        client_secret: MAL_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code,
        redirect_uri: MAL_REDIRECT_URI,
        code_verifier: 'paavanpaavanpaavanpaavanpaavanpaavanpaavanpaavan', // Should match what was used in the request
      }),
    });
    console.log('🚀 ~ GET ~ response:', response);

    if (!response.ok) {
      throw new Error('Failed to fetch access token');
    }

    const data = await response.json();
    console.log('🚀 ~ GET ~ data:', data);
    const { access_token, refresh_token } = data;

    await kv.set('mal_access_token', access_token, { ex: 29 * 24 * 60 * 60 });
    await kv.set('mal_refresh_token', refresh_token, {
      ex: 300 * 24 * 60 * 60,
    });

    return NextResponse.redirect(new URL('/anime', req.nextUrl.origin));
  } catch (error) {
    console.error('Error exchanging authorization code:', error);
    return NextResponse.json(
      { error: 'Failed to obtain access token' },
      { status: 500 }
    );
  }
}
