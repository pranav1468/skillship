import { type NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export async function POST(request: NextRequest) {
  const body = await request.json();

  const djangoRes = await fetch(`${API_BASE}/auth/token/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await djangoRes.json();

  if (!djangoRes.ok) {
    return NextResponse.json(data, { status: djangoRes.status });
  }

  const response = NextResponse.json({
    user: data.user,
    accessToken: data.access,
  });

  // Refresh token in httpOnly cookie — JS never touches it
  response.cookies.set("skillship_refresh", data.refresh, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });

  return response;
}
