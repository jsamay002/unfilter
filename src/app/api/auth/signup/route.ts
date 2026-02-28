import { NextRequest, NextResponse } from "next/server";
import { createUser, findUserByEmail, findUserByUsername, verifyUser } from "../../_lib/db";
import {
  hashPassword,
  generateVerificationToken,
  sendVerificationEmail,
} from "../../_lib/auth";

/*  POST /api/auth/signup
    Body: { username, email, password }
    - Validates input
    - Checks for existing user
    - Hashes password
    - Creates user record
    - If SMTP configured: sends verification email
    - If no SMTP (dev): auto-verifies the account immediately
*/

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, email, password } = body;

    // ---- Validation ----
    const errors: string[] = [];

    if (!username || typeof username !== "string") {
      errors.push("Username is required.");
    } else if (username.length < 3 || username.length > 24) {
      errors.push("Username must be 3-24 characters.");
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      errors.push("Username can only contain letters, numbers, and underscores.");
    }

    if (!email || typeof email !== "string") {
      errors.push("Email is required.");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push("Invalid email address.");
    }

    if (!password || typeof password !== "string") {
      errors.push("Password is required.");
    } else if (password.length < 8) {
      errors.push("Password must be at least 8 characters.");
    } else if (password.length > 128) {
      errors.push("Password must be 128 characters or fewer.");
    }

    if (errors.length > 0) {
      return NextResponse.json({ ok: false, errors }, { status: 400 });
    }

    // ---- Check duplicates ----
    if (findUserByEmail(email)) {
      return NextResponse.json(
        { ok: false, errors: ["An account with this email already exists."] },
        { status: 409 },
      );
    }
    if (findUserByUsername(username)) {
      return NextResponse.json(
        { ok: false, errors: ["This username is taken."] },
        { status: 409 },
      );
    }

    // ---- Create user ----
    const passwordHash = await hashPassword(password);
    const verificationToken = generateVerificationToken();
    const user = createUser(username, email, passwordHash, verificationToken);

    // ---- Email verification ----
    const hasSmtp = !!(process.env.SMTP_USER && process.env.SMTP_PASS);

    if (hasSmtp) {
      // Production: send real email, user must verify
      await sendVerificationEmail(email, username, verificationToken);
      return NextResponse.json({
        ok: true,
        message: "Account created. Check your email for a verification link.",
        autoVerified: false,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          emailVerified: false,
        },
      });
    } else {
      // Dev mode: auto-verify immediately so login works
      verifyUser(user.id);
      console.log(`\n✅ Auto-verified user "${username}" (${email}) — no SMTP configured\n`);
      return NextResponse.json({
        ok: true,
        message: "Account created and verified. You can log in now.",
        autoVerified: true,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          emailVerified: true,
        },
      });
    }
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json(
      { ok: false, errors: ["Something went wrong. Please try again."] },
      { status: 500 },
    );
  }
}
