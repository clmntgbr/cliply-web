import { BACKEND_API_URL, createAuthHeaders, handleApiError, requireAuth } from "@/lib/api-helpers";
import { pick } from "lodash";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if ("error" in auth) return auth.error;

    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();

    const response = await fetch(`${BACKEND_API_URL}/clips?${queryString}`, {
      method: "GET",
      headers: createAuthHeaders(auth.token),
    });

    if (!response.ok) {
      return NextResponse.json({ success: false }, { status: response.status });
    }

    const data = await response.json();
    const clips = pick(data, ["member", "totalItems", "currentPage", "itemsPerPage", "totalPages", "view"]);

    return NextResponse.json(clips);
  } catch (error) {
    return handleApiError(error);
  }
}
