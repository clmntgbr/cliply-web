import { BACKEND_API_URL, createAuthHeaders, handleApiError, requireAuth } from "@/lib/api-helpers";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const auth = requireAuth(request);
    if ("error" in auth) return auth.error;

    const response = await fetch(`${BACKEND_API_URL}/clips/${id}/delete`, {
      method: "GET",
      headers: createAuthHeaders(auth.token),
    });

    if (!response.ok) {
      return NextResponse.json({ success: false }, { status: response.status });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}

