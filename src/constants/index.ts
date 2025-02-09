export const MAL_API_URL =
  process.env.NEXT_PUBLIC_MAL_API_URL || 'https://api.myanimelist.net/v2';
export const MAL_CLIENT_ID = process.env.NEXT_PUBLIC_MAL_CLIENT_ID;
export const MAL_CLIENT_SECRET = process.env.NEXT_PUBLIC_MAL_CLIENT_SECRET;
export const MAL_ACCESS_TOKEN = `Bearer ${process.env.NEXT_PUBLIC_MAL_ACCESS_TOKEN}`;
