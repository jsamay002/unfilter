import { NextResponse } from "next/server";

/*  POST /api/auth/logout
    - Clears the session cookie
*/

export async function POST() {
  const response = NextResponse.json({ ok: true });

  response.cookies.set("unfilter_session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  return response;
}
