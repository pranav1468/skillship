import { type NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1";

export async function POST(request: NextRequest) {
  const refreshToken = request.cookies.get("skillship_refresh")?.value;

  // Blacklist the refresh token on Django (best-effort — don't fail if backend is down)
  if (refreshToken) {
    await fetch(`${API_BASE}/auth/token/blacklist/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: refreshToken }),
    }).catch(() => {});
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set("skillship_refresh", "", { httpOnly: true, maxAge: 0, path: "/" });
  return response;
}
