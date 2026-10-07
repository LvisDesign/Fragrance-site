import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const order = await db.findOrderByTrackingCodeOrId(id);

    if (!order) {
      return NextResponse.json(
        { success: false, error: `Order record with tracking reference or ID '${id}' not found.` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: order,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "An error occurred while retrieving order details." },
      { status: 500 }
    );
  }
}
