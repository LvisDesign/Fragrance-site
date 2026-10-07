import { Request, Response, NextFunction } from "express";
import { sendError } from "../utils/response";

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error("[EXPRESS SERVER ERROR]:", err);
  const status = err.status || 500;
  const message = err.message || "An unexpected server error occurred.";
  return sendError(res, message, status);
}
