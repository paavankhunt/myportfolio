export const MAL_API_URL =
  process.env.MAL_API_URL || 'https://api.myanimelist.net/v2';
export const MAL_REDIRECT_URI =
  process.env.MAL_REDIRECT_URI || 'http://localhost:3000/anime';
export const MAL_CLIENT_ID = process.env.MAL_CLIENT_ID || '';
export const MAL_CLIENT_SECRET = process.env.MAL_CLIENT_SECRET || '';
export const MAL_ACCESS_TOKEN = process.env.MAL_ACCESS_TOKEN
  ? `Bearer ${process.env.MAL_ACCESS_TOKEN}`
  : '';
export const MAL_REFRESH_TOKEN = process.env.MAL_REFRESH_TOKEN || '';
export const KV_URL = process.env.KV_URL;
export const KV_REST_API_READ_ONLY_TOKEN =
  process.env.KV_REST_API_READ_ONLY_TOKEN;
export const KV_REST_API_TOKEN = process.env.KV_REST_API_TOKEN;
export const KV_REST_API_URL = process.env.KV_REST_API_URL;
