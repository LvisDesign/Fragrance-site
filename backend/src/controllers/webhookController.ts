import { Request, Response } from "express";
import { verifyPaystackSignature } from "../utils/hmac";
import { env } from "../config/env";
import { OrderService } from "../services/orderService";
import { sendSuccess, sendError } from "../utils/response";

export class WebhookController {
  /**
   * POST /api/v1/webhooks/paystack
   * Paystack webhook processing with HMAC SHA512 verification & idempotency
   */
  static async handlePaystackWebhook(req: Request, res: Response) {
    try {
      const signatureHeader = req.headers["x-paystack-signature"] as string | undefined;

      // Access raw body string for HMAC calculation
      const rawBody = (req as any).rawBody || JSON.stringify(req.body);

      const isValidSignature = verifyPaystackSignature(rawBody, signatureHeader, env.PAYSTACK_SECRET_KEY);

      if (!isValidSignature && env.NODE_ENV === "production") {
        return sendError(res, "Invalid Paystack webhook signature verification failed.", 401);
      }

      const payload = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
      const { event, data } = payload;

      if (event === "charge.success") {
        const reference = data.reference;

        const result = await OrderService.processAtomicPaystackFulfillment(reference);

        if (result.alreadyProcessed) {
          return sendSuccess(res, null, "Event idempotency check passed. Order payment already processed.", 200);
        }

        if (!result.order) {
          return sendError(res, `Order record not found for payment reference '${reference}'.`, 404);
        }

        console.log(`[STANDALONE BACKEND] Charge success processed for order ${result.order.trackingCode} (${result.order.customerEmail})`);
        return sendSuccess(res, { trackingCode: result.order.trackingCode }, "Paystack fulfillment processed successfully.");
      }

      return sendSuccess(res, null, `Event '${event}' acknowledged.`);
    } catch (error: any) {
      return sendError(res, error?.message || "Paystack webhook processing failed.", 500);
    }
  }
}
