import { BACKEND_API_URL, createAuthHeaders, handleApiError, requireAuth } from "@/lib/api-helpers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const auth = requireAuth(request);
    if ("error" in auth) return auth.error;

    const response = await fetch(`${BACKEND_API_URL}/clips/${id}/download`, {
      method: "GET",
      headers: createAuthHeaders(auth.token),
    });

    if (!response.ok) {
      return NextResponse.json({ success: false }, { status: response.status });
    }

    const blob = await response.blob();
    const contentType = response.headers.get("content-type") || "application/zip";
    const contentDisposition = response.headers.get("content-disposition");

    return new NextResponse(blob, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        ...(contentDisposition && {
          "Content-Disposition": contentDisposition,
        }),
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
