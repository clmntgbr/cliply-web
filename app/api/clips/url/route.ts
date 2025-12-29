import { BACKEND_API_URL, createAuthHeaders, handleApiError, requireAuth } from "@/lib/api-helpers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if ("error" in auth) return auth.error;

    const body = await request.json();

    const response = await fetch(`${BACKEND_API_URL}/clips/url`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...createAuthHeaders(auth.token),
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return NextResponse.json({ success: false }, { status: response.status });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
