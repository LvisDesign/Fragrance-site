import { db } from "../config/db";

export class OrderService {
  static async getOrdersByCustomerEmail(email: string) {
    return await db.findOrdersByEmail(email);
  }

  static async getOrderByIdOrTrackingCode(idOrCode: string) {
    return await db.findOrderByTrackingCodeOrId(idOrCode);
  }

  static async processAtomicPaystackFulfillment(paymentReference: string) {
    // Idempotency check: Ensure payment reference hasn't already been processed
    const existingOrder = await db.findOrderByReference(paymentReference);
    if (existingOrder && existingOrder.paymentStatus === "SUCCESS") {
      return { alreadyProcessed: true, order: existingOrder };
    }

    const updatedOrder = await db.executeAtomicWebhookFulfillment(paymentReference);
    return { alreadyProcessed: false, order: updatedOrder };
  }
}
