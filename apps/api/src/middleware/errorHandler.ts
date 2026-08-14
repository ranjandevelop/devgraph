import type { ErrorRequestHandler, RequestHandler } from "express";
import { ZodError } from "zod";

export class AppError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export const notFoundHandler: RequestHandler = (_req, res) => {
  res.status(404).json({ error: { message: "Not found" } });
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ZodError) {
    res.status(400).json({ error: { message: err.issues[0]?.message ?? "Invalid request" } });
    return;
  }

  if (err instanceof AppError) {
    res.status(err.status).json({ error: { message: err.message } });
    return;
  }

  if (err?.code === "ServiceUnavailable") {
    console.error("Database unavailable:", err);
    res.status(503).json({ error: { message: "Database unavailable" } });
    return;
  }

  console.error("Unexpected error:", err);
  res.status(500).json({ error: { message: "Internal server error" } });
};
