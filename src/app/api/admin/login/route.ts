import { NextRequest, NextResponse } from "next/server";
import {
  verifyAdminCredentials,
  createAdminSessionToken,
  ADMIN_COOKIE_NAME,
} from "@/lib/auth/admin-auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Please provide both admin email and password." },
        { status: 400 }
      );
    }

    const verification = await verifyAdminCredentials(email, password);

    if (!verification.isValid) {
      return NextResponse.json(
        { success: false, error: verification.error || "Incorrect email or password. Please try again." },
        { status: 401 }
      );
    }

    const sessionToken = createAdminSessionToken(verification.isDefaultPassword);

    const response = NextResponse.json({
      success: true,
      message: "Admin authentication successful.",
      isDefaultPassword: verification.isDefaultPassword,
      redirectUrl: "/admin/catalog",
    });

    // Set secure HTTP-only cookie
    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "An unexpected server error occurred during admin authentication." },
      { status: 500 }
    );
  }
}
