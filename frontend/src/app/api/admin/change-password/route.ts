import { NextRequest, NextResponse } from "next/server";
import {
  verifyAdminCredentials,
  createAdminSessionToken,
  ADMIN_COOKIE_NAME,
  DEFAULT_ADMIN_CREDENTIALS,
} from "@/lib/auth/admin-auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, error: "Please enter your current password and a new password." },
        { status: 400 }
      );
    }

    if (newPassword.length < 4) {
      return NextResponse.json(
        { success: false, error: "New password must be at least 4 characters long." },
        { status: 400 }
      );
    }

    const verification = await verifyAdminCredentials(DEFAULT_ADMIN_CREDENTIALS.email, currentPassword);

    if (!verification.isValid) {
      return NextResponse.json(
        { success: false, error: "Current password is incorrect." },
        { status: 401 }
      );
    }

    // Set updated password cookie
    const isNewDefault = newPassword === DEFAULT_ADMIN_CREDENTIALS.password;
    const sessionToken = createAdminSessionToken(isNewDefault);

    const response = NextResponse.json({
      success: true,
      message: "Admin password successfully updated.",
      isDefaultPassword: isNewDefault,
    });

    response.cookies.set({
      name: "tps_admin_custom_pass",
      value: newPassword,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // 1 year
    });

    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "An error occurred while updating admin password." },
      { status: 500 }
    );
  }
}
