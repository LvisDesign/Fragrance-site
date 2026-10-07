import { cookies } from "next/headers";
import { NextResponse, NextRequest } from "next/server";

export const DEFAULT_ADMIN_CREDENTIALS = {
  email: "theperfumeslut@gmail.com",
  password: "0000",
  role: "ADMIN" as const,
};

export const ADMIN_COOKIE_NAME = "tps_admin_session";

export interface AdminSession {
  email: string;
  role: "ADMIN";
  isDefaultPassword: boolean;
  loggedInAt: string;
}

/**
 * Get stored custom admin password from cookies or fall back to default '0000'
 */
export async function getStoredAdminPassword(): Promise<string> {
  try {
    const cookieStore = await cookies();
    const customPass = cookieStore.get("tps_admin_custom_pass")?.value;
    if (customPass) return customPass;
  } catch (e) {
    // Edge / client environment fallback
  }
  return DEFAULT_ADMIN_CREDENTIALS.password;
}

/**
 * Verify admin credentials against stored or seed credentials
 */
export async function verifyAdminCredentials(emailInput: string, passwordInput: string): Promise<{
  isValid: boolean;
  isDefaultPassword: boolean;
  error?: string;
}> {
  const normalizedEmail = emailInput.trim().toLowerCase();
  const currentPassword = await getStoredAdminPassword();

  const isEmailMatch = normalizedEmail === DEFAULT_ADMIN_CREDENTIALS.email.toLowerCase();

  if (!isEmailMatch) {
    return { isValid: false, isDefaultPassword: false, error: "Incorrect email or password. Please try again." };
  }

  if (passwordInput !== currentPassword && passwordInput !== DEFAULT_ADMIN_CREDENTIALS.password) {
    return { isValid: false, isDefaultPassword: false, error: "Incorrect email or password. Please try again." };
  }

  const isDefault = passwordInput === DEFAULT_ADMIN_CREDENTIALS.password && currentPassword === DEFAULT_ADMIN_CREDENTIALS.password;

  return {
    isValid: true,
    isDefaultPassword: isDefault,
  };
}

/**
 * Helper to check session payload from cookie value
 */
export function parseAdminSessionToken(token: string | undefined): AdminSession | null {
  if (!token) return null;
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const parsed = JSON.parse(decoded) as AdminSession;
    if (parsed.email === DEFAULT_ADMIN_CREDENTIALS.email && parsed.role === "ADMIN") {
      return parsed;
    }
  } catch (e) {
    return null;
  }
  return null;
}

/**
 * Create base64 session token
 */
export function createAdminSessionToken(isDefaultPassword: boolean): string {
  const session: AdminSession = {
    email: DEFAULT_ADMIN_CREDENTIALS.email,
    role: "ADMIN",
    isDefaultPassword,
    loggedInAt: new Date().toISOString(),
  };
  return Buffer.from(JSON.stringify(session)).toString("base64");
}
