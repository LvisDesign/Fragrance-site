import { Router } from "express";
import { WebhookController } from "../controllers/webhookController";

const router = Router();

router.post("/paystack", WebhookController.handlePaystackWebhook);

export default router;
