import { BACKEND_API_URL, createAuthHeaders, handleApiError, requireAuth } from "@/lib/api-helpers";
import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 3600;

export async function POST(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if ("error" in auth) return auth.error;

    const formData = await request.formData();

    const response = await fetch(`${BACKEND_API_URL}/clips/video`, {
      method: "POST",
      headers: createAuthHeaders(auth.token),
      body: formData,
    });

    if (!response.ok) {
      return NextResponse.json({ success: false }, { status: response.status });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
