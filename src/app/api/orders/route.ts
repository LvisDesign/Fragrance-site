import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Please provide a customer email address parameter." },
        { status: 400 }
      );
    }

    const orders = await db.findOrdersByEmail(email);

    return NextResponse.json({
      success: true,
      email,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "An error occurred while retrieving order history." },
      { status: 500 }
    );
  }
}
