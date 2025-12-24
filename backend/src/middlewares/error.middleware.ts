import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

export function errorMiddleware(err: any, _req: Request, res: Response, _next: NextFunction) {
  // Zod validation
  if (err instanceof ZodError) {
    return res.status(400).json({
      message: "Validation error",
      errors: err.issues.map((i) => ({ field: i.path.join("."), msg: i.message })),
    });
  }

  // Multer file size limit
  if (err?.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({ message: "Avatar too large (max 2MB)" });
  }

  // Mongo duplicate key (unique email)
  if (err?.code === 11000) {
    return res.status(409).json({ message: "Email already exists" });
  }

  const status = err?.statusCode || 500;
  const message = err?.message || "Internal server error";
  return res.status(status).json({ message });
}