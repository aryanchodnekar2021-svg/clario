import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const BACKEND_URL = process.env.BACKEND_URL || 'https://api.clario.app'; // Placeholder base URL

export async function GET(
  req: NextRequest,
  { params }: { params: { proxy: string[] } }
) {
  const proxyPath = params?.proxy ? params.proxy.join('/') : '';
  const searchParams = req.nextUrl.searchParams.toString();
  const targetUrl = `${BACKEND_URL}/${proxyPath}${searchParams ? '?' + searchParams : ''}`;

  try {
    const response = await axios.get(targetUrl, {
      headers: {
        'Accept': 'application/json',
      },
    });
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('API Proxy Error:', error.message);
    return NextResponse.json(
      { error: 'Failed to fetch from backend', detail: error.message },
      { status: error.response?.status || 500 }
    );
  }
}
