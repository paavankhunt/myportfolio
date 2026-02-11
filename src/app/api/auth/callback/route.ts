import { NextRequest, NextResponse } from 'next/server';
import {
  MAL_CLIENT_ID,
  MAL_CLIENT_SECRET,
  MAL_REDIRECT_URI,
} from '@/constants';

// Use the same code verifier that you use in the authorization request
const CODE_VERIFIER = 'paavanpaavanpaavanpaavanpaavanpaavanpaavanpaavan';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');

  if (!code) {
    console.error('❌ Authorization code missing');
    return NextResponse.json(
      { error: 'Authorization code missing' },
      { status: 400 },
    );
  }

  try {
    console.log('🔄 Exchanging authorization code for access token...');

    // Exchange the code for an access token
    const response = await fetch('https://myanimelist.net/v1/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: MAL_CLIENT_ID,
        client_secret: MAL_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: MAL_REDIRECT_URI,
        code_verifier: CODE_VERIFIER,
      }).toString(),
    });

    console.log('📡 Token exchange response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Token exchange failed:', errorText);
      throw new Error(
        `Failed to fetch access token: ${response.status} - ${errorText}`,
      );
    }

    const data = await response.json();
    console.log('✅ Access token obtained successfully');

    const { access_token, refresh_token, expires_in } = data;

    // Calculate expiration time (default 31 days if not provided)
    const expiresInSeconds = expires_in || 31 * 24 * 60 * 60;
    const expirationDate = new Date(Date.now() + expiresInSeconds * 1000);

    // Create response with redirect
    const redirectResponse = NextResponse.redirect(
      new URL('/anime', req.nextUrl.origin),
    );

    // Store tokens in HTTP-only cookies for security
    redirectResponse.cookies.set('mal_access_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: expirationDate,
      path: '/',
    });

    if (refresh_token) {
      // Refresh token expires in ~300 days
      const refreshExpirationDate = new Date(
        Date.now() + 300 * 24 * 60 * 60 * 1000,
      );
      redirectResponse.cookies.set('mal_refresh_token', refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        expires: refreshExpirationDate,
        path: '/',
      });
    }

    // Store token expiration time
    redirectResponse.cookies.set(
      'mal_token_expires_at',
      expirationDate.getTime().toString(),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        expires: expirationDate,
        path: '/',
      },
    );

    console.log('✅ Tokens stored in cookies');
    console.log('🔄 Redirecting to /anime');

    return redirectResponse;
  } catch (error) {
    console.error('❌ Error exchanging authorization code:', error);
    return NextResponse.json(
      {
        error: 'Failed to obtain access token',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
