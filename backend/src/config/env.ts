import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

export const env = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || "development",
  DATABASE_URL: process.env.DATABASE_URL || "postgresql://tps_admin:tps_password@localhost:5432/theperfumeslut_db?schema=public",
  PAYSTACK_SECRET_KEY: process.env.PAYSTACK_SECRET_KEY || "sk_test_mock_tps_paystack_secret_key_8492",
  ADMIN_JWT_SECRET: process.env.ADMIN_JWT_SECRET || "tps_admin_jwt_super_secret_signing_key_9021",
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3001",
};
