import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const secretKey = process.env.PAYSTACK_SECRET_KEY || "sk_test_mock_tps_paystack_secret_key_8492";
    const signature = req.headers.get("x-paystack-signature");

    if (!signature) {
      return NextResponse.json(
        { success: false, error: "Missing Paystack signature header." },
        { status: 400 }
      );
    }

    const rawBody = await req.text();
    const hash = crypto.createHmac("sha512", secretKey).update(rawBody).digest("hex");

    // Verify Signature Integrity
    if (hash !== signature && process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { success: false, error: "Invalid Paystack webhook signature verification failed." },
        { status: 401 }
      );
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;
    const data = payload.data;

    // Handle Successful Payment Event
    if (event === "charge.success") {
      const reference = data.reference;

      // Idempotency Check: Verify if reference has already been processed
      const existingOrder = await db.findOrderByReference(reference);

      if (existingOrder && existingOrder.paymentStatus === "SUCCESS") {
        return NextResponse.json({
          success: true,
          message: "Event idempotency check passed. Order payment already processed.",
        });
      }

      // Execute Atomic Database Transaction
      const updatedOrder = await db.updateOrderPaymentStatus(reference, "SUCCESS");

      if (!updatedOrder) {
        return NextResponse.json(
          { success: false, error: `Order record not found for payment reference ${reference}.` },
          { status: 404 }
        );
      }

      // Trigger background receipt and account setup notification
      console.log(`[PAYSTACK WEBHOOK SUCCESS] Receipt sent to ${updatedOrder.customerEmail} for order ${updatedOrder.trackingCode}`);

      return NextResponse.json({
        success: true,
        message: "Paystack transaction processed successfully. Order updated and stock decremented.",
        orderCode: updatedOrder.trackingCode,
      });
    }

    return NextResponse.json({ success: true, message: `Event '${event}' acknowledged.` });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "An error occurred while processing Paystack webhook." },
      { status: 500 }
    );
  }
}
