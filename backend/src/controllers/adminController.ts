import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { InventoryService } from "../services/inventoryService";
import { sendSuccess, sendError } from "../utils/response";

export class AdminController {
  /**
   * POST /api/v1/admin/auth/login
   * Validates default credentials (theperfumeslut@gmail.com / 0000)
   */
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return sendError(res, "Please provide admin email and password.", 400);
      }

      const normalizedEmail = email.trim().toLowerCase();

      const isEmailValid = normalizedEmail === "theperfumeslut@gmail.com";
      if (!isEmailValid || password !== "0000") {
        return sendError(res, "Incorrect email or password. Please try again.", 401);
      }

      const token = jwt.sign(
        {
          id: "usr-admin-1",
          email: "theperfumeslut@gmail.com",
          role: "ADMIN",
        },
        env.ADMIN_JWT_SECRET,
        { expiresIn: "7d" }
      );

      return sendSuccess(
        res,
        {
          token,
          admin: {
            id: "usr-admin-1",
            email: "theperfumeslut@gmail.com",
            role: "ADMIN",
          },
        },
        "Admin authentication successful."
      );
    } catch (error: any) {
      return sendError(res, error?.message || "Admin login authentication failed.", 500);
    }
  }

  /**
   * GET /api/v1/admin/products
   * Filtered & paginated catalog list
   */
  static async getProducts(req: Request, res: Response) {
    try {
      const category = req.query.category as string;
      const search = req.query.search as string;

      const products = await InventoryService.getCatalog({ category, search });
      return sendSuccess(res, products, "Catalog fetched successfully.");
    } catch (error: any) {
      return sendError(res, "Failed to retrieve product catalog.", 500);
    }
  }

  /**
   * POST /api/v1/admin/products
   * Create new product (Protected by adminAuthMiddleware)
   */
  static async createProduct(req: Request, res: Response) {
    try {
      const { name, category, olfactoryFamily, formulationTier, priceNGN, stockQuantity } = req.body;

      if (!name || !category || !olfactoryFamily || !formulationTier || priceNGN === undefined) {
        return sendError(
          res,
          "Missing required fields: name, category, olfactoryFamily, formulationTier, and priceNGN are mandatory.",
          400
        );
      }

      const product = await InventoryService.createProduct(req.body);
      return sendSuccess(res, product, "Product created successfully.", 201);
    } catch (error: any) {
      return sendError(res, "Failed to create product entry.", 500);
    }
  }

  /**
   * PUT /api/v1/admin/products/:id
   * Update product inventory or details
   */
  static async updateProduct(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updated = await InventoryService.updateProduct(id, req.body);

      if (!updated) {
        return sendError(res, `Product with ID '${id}' not found.`, 404);
      }

      return sendSuccess(res, updated, "Product details updated successfully.");
    } catch (error: any) {
      return sendError(res, "Failed to update product details.", 500);
    }
  }

  /**
   * DELETE /api/v1/admin/products/:id
   * Delete or soft-delete product
   */
  static async deleteProduct(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const deleted = await InventoryService.deleteProduct(id);

      if (!deleted) {
        return sendError(res, `Product with ID '${id}' not found.`, 404);
      }

      return sendSuccess(res, null, "Product removed from catalog successfully.");
    } catch (error: any) {
      return sendError(res, "Failed to delete product entry.", 500);
    }
  }
}
