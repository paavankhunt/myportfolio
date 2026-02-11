import { cookies } from 'next/headers';
import { MAL_CLIENT_ID, MAL_CLIENT_SECRET } from '@/constants';

/**
 * Get a valid access token from cookies
 * Automatically refreshes if expired
 */
export async function getValidAccessToken(): Promise<string | null> {
  const cookieStore = cookies();

  const accessToken = cookieStore.get('mal_access_token')?.value;
  const refreshToken = cookieStore.get('mal_refresh_token')?.value;
  const expiresAt = cookieStore.get('mal_token_expires_at')?.value;

  // If no access token, return null
  if (!accessToken) {
    return null;
  }

  // Check if token is still valid (with 5 minute buffer)
  if (expiresAt) {
    const expirationTime = parseInt(expiresAt);
    const bufferTime = 5 * 60 * 1000; // 5 minutes

    if (Date.now() < expirationTime - bufferTime) {
      // Token is still valid
      return `Bearer ${accessToken}`;
    }
  }

  // Token expired or about to expire, try to refresh
  if (refreshToken) {
    console.log('🔄 Access token expired, refreshing...');
    const newToken = await refreshAccessToken(refreshToken);
    if (newToken) {
      return `Bearer ${newToken}`;
    }
  }

  return null;
}

/**
 * Refresh the access token using the refresh token
 */
async function refreshAccessToken(
  refreshToken: string,
): Promise<string | null> {
  try {
    const response = await fetch('https://myanimelist.net/v1/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: MAL_CLIENT_ID,
        client_secret: MAL_CLIENT_SECRET,
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }).toString(),
    });

    if (!response.ok) {
      console.error('❌ Failed to refresh token:', response.status);
      return null;
    }

    const data = await response.json();
    const { access_token, refresh_token: new_refresh_token, expires_in } = data;

    // Calculate new expiration time
    const expiresInSeconds = expires_in || 31 * 24 * 60 * 60;
    const expirationDate = new Date(Date.now() + expiresInSeconds * 1000);

    // Update cookies with new tokens
    const cookieStore = cookies();

    cookieStore.set('mal_access_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: expirationDate,
      path: '/',
    });

    if (new_refresh_token) {
      const refreshExpirationDate = new Date(
        Date.now() + 300 * 24 * 60 * 60 * 1000,
      );
      cookieStore.set('mal_refresh_token', new_refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        expires: refreshExpirationDate,
        path: '/',
      });
    }

    cookieStore.set(
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

    console.log('✅ Token refreshed successfully');
    return access_token;
  } catch (error) {
    console.error('❌ Error refreshing token:', error);
    return null;
  }
}

/**
 * Clear all MAL authentication cookies
 */
export function clearAuthCookies(): void {
  const cookieStore = cookies();
  cookieStore.delete('mal_access_token');
  cookieStore.delete('mal_refresh_token');
  cookieStore.delete('mal_token_expires_at');
}
