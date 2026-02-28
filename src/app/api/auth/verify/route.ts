import { NextRequest, NextResponse } from "next/server";
import { findUserByVerificationToken, verifyUser } from "../../_lib/db";

/*  GET /api/auth/verify?token=xxx
    - Finds user by verification token
    - Checks expiration
    - Marks user as verified
    - Redirects to login page
*/

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/login?error=missing_token", req.url));
  }

  const user = findUserByVerificationToken(token);

  if (!user) {
    return NextResponse.redirect(new URL("/login?error=invalid_token", req.url));
  }

  // Check expiration
  if (user.verification_expires && Date.now() > user.verification_expires) {
    return NextResponse.redirect(new URL("/login?error=expired_token", req.url));
  }

  // Verify the user
  verifyUser(user.id);

  // Redirect to login with success message
  return NextResponse.redirect(new URL("/login?verified=true", req.url));
}
