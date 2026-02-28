import { NextRequest, NextResponse } from "next/server";
import { findUserByEmail } from "../../_lib/db";
import { verifyPassword, signToken } from "../../_lib/auth";

/*  POST /api/auth/login
    Body: { email, password }
    - Finds user by email (case-insensitive)
    - Verifies password with bcrypt
    - Checks email verification
    - Sets httpOnly JWT cookie
    - Returns user info (no sensitive data)
*/

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { ok: false, errors: ["Email and password are required."] },
        { status: 400 },
      );
    }

    const trimmedEmail = email.trim().toLowerCase();

    // ---- Find user ----
    const user = findUserByEmail(trimmedEmail);
    if (!user) {
      console.log(`Login failed: no user found for email "${trimmedEmail}"`);
      return NextResponse.json(
        { ok: false, errors: ["Invalid email or password."] },
        { status: 401 },
      );
    }

    // ---- Verify password ----
    let valid = false;
    try {
      valid = await verifyPassword(password, user.password_hash);
    } catch (err) {
      console.error("bcrypt error:", err);
      return NextResponse.json(
        { ok: false, errors: ["Authentication error. Please try again."] },
        { status: 500 },
      );
    }

    if (!valid) {
      console.log(`Login failed: wrong password for "${trimmedEmail}"`);
      return NextResponse.json(
        { ok: false, errors: ["Invalid email or password."] },
        { status: 401 },
      );
    }

    // ---- Check email verification ----
    if (!user.email_verified) {
      console.log(`Login blocked: email not verified for "${trimmedEmail}"`);
      return NextResponse.json(
        {
          ok: false,
          errors: ["Please verify your email before logging in. Check your inbox."],
          needsVerification: true,
        },
        { status: 403 },
      );
    }

    // ---- Issue JWT ----
    const token = signToken({
      userId: user.id,
      email: user.email,
      username: user.username,
    });

    const response = NextResponse.json({
      ok: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });

    // httpOnly cookie — not accessible via JavaScript
    response.cookies.set("unfilter_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    console.log(`✅ Login success: "${user.username}" (${user.email})`);
    return response;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { ok: false, errors: ["Something went wrong. Please try again."] },
      { status: 500 },
    );
  }
}
