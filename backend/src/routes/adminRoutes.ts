import { Router } from "express";
import { AdminController } from "../controllers/adminController";
import { adminAuthMiddleware } from "../middleware/adminAuth";

const router = Router();

// Public Admin Auth Route
router.post("/auth/login", AdminController.login);

// Protected Admin Catalog Routes
router.get("/products", AdminController.getProducts);
router.post("/products", adminAuthMiddleware, AdminController.createProduct);
router.put("/products/:id", adminAuthMiddleware, AdminController.updateProduct);
router.delete("/products/:id", adminAuthMiddleware, AdminController.deleteProduct);

export default router;
