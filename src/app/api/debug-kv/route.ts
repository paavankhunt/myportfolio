import { kv } from '@vercel/kv';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    console.log('🚀 Testing KV Storage...');

    const testSet = await kv.set('test_key', 'Hello, KV!');
    const testGet = await kv.get('test_key');

    console.log('✅ KV Test Result:', testGet); // Should print: "Hello, KV!"

    const accessToken = await kv.get<string>('mal_access_token');
    console.log('🚀 ~ getValidAccessToken ~ accessToken:', accessToken);

    if (!accessToken) throw new Error('Access token is null or undefined');

    return NextResponse.json({ success: true, accessToken });
  } catch (error: any) {
    console.error('❌ Error fetching anime list:', error);
    return NextResponse.json(
      { error: error?.message || 'An error occurred' },
      { status: 500 }
    );
  }
}
