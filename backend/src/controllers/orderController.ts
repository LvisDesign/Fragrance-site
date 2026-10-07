import { Request, Response } from "express";
import { OrderService } from "../services/orderService";
import { sendSuccess, sendError } from "../utils/response";

export class OrderController {
  /**
   * GET /api/v1/orders?email=...
   * Fetch complete purchase history matching a customer email
   */
  static async getOrdersByEmail(req: Request, res: Response) {
    try {
      const email = req.query.email as string;

      if (!email) {
        return sendError(res, "Please provide a customer email address parameter.", 400);
      }

      const orders = await OrderService.getOrdersByCustomerEmail(email);
      return sendSuccess(res, orders, `Found ${orders.length} order(s) for email '${email}'.`);
    } catch (error: any) {
      return sendError(res, "Failed to retrieve order history.", 500);
    }
  }

  /**
   * GET /api/v1/orders/:id
   * Retrieve single order details and live fulfillment stage
   */
  static async getOrderById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const order = await OrderService.getOrderByIdOrTrackingCode(id);

      if (!order) {
        return sendError(res, `Order record with reference or ID '${id}' not found.`, 404);
      }

      return sendSuccess(res, order, "Order status retrieved successfully.");
    } catch (error: any) {
      return sendError(res, "Failed to retrieve order details.", 500);
    }
  }
}
