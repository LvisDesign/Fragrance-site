import express, { Request, Response } from "express";
import cors from "cors";
import { env } from "./config/env";
import adminRoutes from "./routes/adminRoutes";
import orderRoutes from "./routes/orderRoutes";
import webhookRoutes from "./routes/webhookRoutes";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

// 1. CORS Configuration with Credential Support
app.use(
  cors({
    origin: [env.FRONTEND_URL, "http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-paystack-signature"],
  })
);

// 2. Raw Body Capture Middleware for Paystack Webhook Verification
app.use(
  express.json({
    verify: (req: Request & { rawBody?: string }, res, buf) => {
      req.rawBody = buf.toString("utf-8");
    },
  })
);
app.use(express.urlencoded({ extended: true }));

// 3. Health Check Endpoints
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "healthy", service: "The Perfume Slut Standalone API", timestamp: new Date().toISOString() });
});

app.get("/api/v1/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "healthy", version: "v1", timestamp: new Date().toISOString() });
});

// 4. API Routers
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/webhooks", webhookRoutes);

// 5. Global Error Handling Middleware
app.use(errorHandler);

export default app;
