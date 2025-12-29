import { BACKEND_API_URL, handleApiError } from "@/lib/api-helpers";
import { setSessionCookie } from "@/lib/session";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const response = await fetch(`${BACKEND_API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return NextResponse.json({ success: false }, { status: response.status });
    }

    const { user, token } = await response.json();

    if (!token || !user) {
      return NextResponse.json({ success: false }, { status: 500 });
    }

    const { id, email, firstname, lastname, picture, roles } = user;
    const nextResponse = NextResponse.json({
      user: { id, email, firstname, lastname, picture, roles },
    });

    setSessionCookie(nextResponse, token);
    return nextResponse;
  } catch (error) {
    return handleApiError(error);
  }
}
