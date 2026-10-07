import { Router } from "express";
import { OrderController } from "../controllers/orderController";

const router = Router();

router.get("/", OrderController.getOrdersByEmail);
router.get("/:id", OrderController.getOrderById);

export default router;
