import { NextRequest, NextResponse } from "next/server";
import { parseAdminSessionToken, ADMIN_COOKIE_NAME } from "@/lib/auth/admin-auth";
import { db } from "@/lib/db";

function isAuthorizedAdmin(req: NextRequest): boolean {
  const cookie = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const session = parseAdminSessionToken(cookie);
  return Boolean(session && session.role === "ADMIN");
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!isAuthorizedAdmin(req)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access. Admin authentication required." },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await req.json();

    const updated = await db.updateProduct(id, body);

    if (!updated) {
      return NextResponse.json(
        { success: false, error: `Product with ID '${id}' not found.` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Product updated successfully.",
      data: updated,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "An error occurred while updating product." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!isAuthorizedAdmin(req)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access. Admin authentication required." },
        { status: 401 }
      );
    }

    const { id } = await params;
    const deleted = await db.deleteProduct(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: `Product with ID '${id}' not found.` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Product removed from catalog successfully.",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "An error occurred while deleting product." },
      { status: 500 }
    );
  }
}
