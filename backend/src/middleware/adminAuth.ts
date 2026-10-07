import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { sendError } from "../utils/response";

export interface AdminJwtPayload {
  id: string;
  email: string;
  role: "ADMIN";
}

export function adminAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return sendError(res, "Access denied. Missing or malformed authorization Bearer token.", 401);
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, env.ADMIN_JWT_SECRET) as AdminJwtPayload;

    if (!decoded || decoded.role !== "ADMIN") {
      return sendError(res, "Forbidden. Admin authorization required for this resource.", 403);
    }

    (req as any).adminUser = decoded;
    next();
  } catch (error) {
    return sendError(res, "Invalid or expired admin session token. Please sign in again.", 401);
  }
}
