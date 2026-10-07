import { NextRequest, NextResponse } from "next/server";
import { parseAdminSessionToken, ADMIN_COOKIE_NAME } from "@/lib/auth/admin-auth";
import { db } from "@/lib/db";

// Helper to verify admin session
function isAuthorizedAdmin(req: NextRequest): boolean {
  const cookie = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const session = parseAdminSessionToken(cookie);
  return Boolean(session && session.role === "ADMIN");
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") || undefined;
    const search = searchParams.get("search") || undefined;

    const products = await db.findProducts({ category, search });

    return NextResponse.json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch admin product catalog." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Security Session Guard
    if (!isAuthorizedAdmin(req)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access. Admin authentication required." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { name, category, olfactoryFamily, formulationTier, priceNGN, stockQuantity } = body;

    // Schema Validation
    if (!name || !category || !olfactoryFamily || !formulationTier || priceNGN === undefined) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required product fields: name, category, olfactoryFamily, formulationTier, and priceNGN are mandatory.",
        },
        { status: 400 }
      );
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

    const newProduct = await db.createProduct({
      name,
      slug,
      category,
      olfactoryFamily,
      formulationTier,
      priceNGN: Number(priceNGN),
      stockQuantity: Number(stockQuantity || 0),
      images: body.images || ["/products/creed_aventus_clean.png"],
    });

    return NextResponse.json(
      {
        success: true,
        message: "Product created successfully and published to storefront.",
        data: newProduct,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "An error occurred while creating product." },
      { status: 500 }
    );
  }
}
