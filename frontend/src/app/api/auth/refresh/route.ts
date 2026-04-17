import { type NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

export async function POST(request: NextRequest) {
  const refreshToken = request.cookies.get("skillship_refresh")?.value;

  if (!refreshToken) {
    return NextResponse.json({ error: "No refresh token" }, { status: 401 });
  }

  const djangoRes = await fetch(`${API_BASE}/auth/token/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh: refreshToken }),
  });

  const data = await djangoRes.json();

  if (!djangoRes.ok) {
    const response = NextResponse.json({ error: "Refresh failed" }, { status: 401 });
    response.cookies.set("skillship_refresh", "", { httpOnly: true, maxAge: 0, path: "/" });
    return response;
  }

  const response = NextResponse.json({ accessToken: data.access });

  // Rotate the refresh token if Django returns a new one
  if (data.refresh) {
    response.cookies.set("skillship_refresh", data.refresh, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: COOKIE_MAX_AGE,
    });
  }

  return response;
}
