import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Add CORS headers to a response
 */
export function setCorsHeaders(response: NextResponse): NextResponse {
  // Add CORS headers to the response
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  return response;
}

/**
 * Handle CORS preflight requests
 */
export function handleCorsPreflightRequest() {
  return setCorsHeaders(new NextResponse(null, { status: 200 }));
}
