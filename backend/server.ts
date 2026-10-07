import app from "./src/app";
import { env } from "./src/config/env";

const server = app.listen(env.PORT, () => {
  console.log(`
  =======================================================
  🚀 THE PERFUME SLUT STANDALONE BACKEND SERVICE IS ACTIVE 🚀
  =======================================================
  📡 Server Listening on Port: ${env.PORT}
  🌐 Environment:             ${env.NODE_ENV}
  🔒 Admin Auth Endpoint:      POST http://localhost:${env.PORT}/api/v1/admin/auth/login
  🛍️ Admin Products API:       GET/POST http://localhost:${env.PORT}/api/v1/admin/products
  📦 Customer Orders API:      GET http://localhost:${env.PORT}/api/v1/orders?email=...
  💳 Paystack Webhook Engine:  POST http://localhost:${env.PORT}/api/v1/webhooks/paystack
  =======================================================
  `);
});

// Handle graceful shutdown
process.on("SIGINT", () => {
  console.log("\n[SIGINT] Shutting down backend server gracefully...");
  server.close(() => {
    process.exit(0);
  });
});
