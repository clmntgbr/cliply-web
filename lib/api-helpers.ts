import { NextRequest, NextResponse } from "next/server";

// Constants
export const SESSION_COOKIE_NAME = "session_token";
export const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

// Error responses
export const ERROR_RESPONSES = {
  UNAUTHORIZED: { success: false, message: "Unauthorized" },
  INTERNAL_ERROR: { success: false, message: "Internal server error" },
  NOT_FOUND: { success: false, message: "Resource not found" },
} as const;

/**
 * Get session token from request cookies
 */
export function getSessionToken(request: NextRequest): string | null {
  return request.cookies.get(SESSION_COOKIE_NAME)?.value || null;
}

/**
 * Check if user is authenticated and return session token
 * Returns token if authenticated, otherwise returns an unauthorized response
 */
export function requireAuth(request: NextRequest): { token: string } | { error: NextResponse } {
  const token = getSessionToken(request);

  if (!token) {
    return {
      error: NextResponse.json(ERROR_RESPONSES.UNAUTHORIZED, { status: 401 }),
    };
  }

  return { token };
}

/**
 * Create authorization headers with bearer token
 */
export function createAuthHeaders(token: string): HeadersInit {
  return {
    Authorization: `Bearer ${token}`,
  };
}

/**
 * Handle API errors consistently
 */
export function handleApiError(error: unknown): NextResponse {
  console.error("API Error:", error);
  return NextResponse.json(ERROR_RESPONSES.INTERNAL_ERROR, { status: 500 });
}

