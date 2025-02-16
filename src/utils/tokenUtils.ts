import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';
import {
  MAL_CLIENT_ID,
  MAL_CLIENT_SECRET,
  MAL_REDIRECT_URI,
} from '@/constants';

/**
 * Get a valid MyAnimeList Access Token
 */
export async function getValidAccessToken(): Promise<string | NextResponse> {
  try {
    // ✅ Check if the access token is stored in KV
    let accessToken = await kv.get<string>('mal_access_token');
    if (accessToken) {
      console.log('✅ Using cached access token:', accessToken);
      return accessToken;
    }

    // ✅ Get refresh token from KV
    let refreshToken = await kv.get<string>('mal_refresh_token');
    if (!refreshToken) {
      console.log('❌ Refresh token missing. Redirecting to login...');
      return NextResponse.redirect(
        `https://myanimelist.net/v1/oauth2/authorize?response_type=code&client_id=${MAL_CLIENT_ID}&redirect_uri=${encodeURIComponent(
          MAL_REDIRECT_URI
        )}&code_challenge=paavanpaavanpaavanpaavanpaavanpaavanpaavanpaavan&code_challenge_method=plain`
      );
    }

    // 🔄 Refresh the access token
    console.log('🔄 Refreshing access token...');
    const response = await fetch('https://myanimelist.net/v1/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: MAL_CLIENT_ID,
        client_secret: MAL_CLIENT_SECRET,
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Failed to refresh token:', errorData);

      if (errorData.error === 'invalid_grant') {
        console.log('❌ Refresh token expired. Redirecting to login...');
        return NextResponse.redirect(
          `https://myanimelist.net/v1/oauth2/authorize?response_type=code&client_id=${MAL_CLIENT_ID}&redirect_uri=${encodeURIComponent(
            MAL_REDIRECT_URI
          )}&code_challenge=paavanpaavanpaavanpaavanpaavanpaavanpaavanpaavan&code_challenge_method=plain`
        );
      }

      throw new Error('Failed to refresh access token');
    }

    const data = await response.json();
    accessToken = data.access_token;
    refreshToken = data.refresh_token;

    // ✅ Store new tokens in KV
    await kv.set('mal_access_token', accessToken, { ex: 29 * 24 * 60 * 60 });
    await kv.set('mal_refresh_token', refreshToken, {
      ex: 300 * 24 * 60 * 60,
    });

    console.log('✅ New Access Token Stored:', accessToken);
    return `Bearer ${accessToken}` || '';
  } catch (error) {
    console.error('❌ Error refreshing token:', error);
    return NextResponse.json(
      { error: 'Failed to refresh token' },
      { status: 500 }
    );
  }
}
