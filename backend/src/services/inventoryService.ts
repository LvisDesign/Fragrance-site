import { db, Product } from "../config/db";

export class InventoryService {
  static async getCatalog(query?: { category?: string; search?: string }) {
    return await db.findProducts(query);
  }

  static async getProductById(id: string) {
    return await db.findProductById(id);
  }

  static async createProduct(productData: Partial<Product>) {
    const slug = (productData.name || "item")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    return await db.createProduct({
      ...productData,
      slug,
    });
  }

  static async updateProduct(id: string, updates: Partial<Product>) {
    return await db.updateProduct(id, updates);
  }

  static async deleteProduct(id: string) {
    return await db.deleteProduct(id);
  }
}
