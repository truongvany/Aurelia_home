import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError.js";

export const errorMiddleware = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (error instanceof ApiError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message
    });
    return;
  }

  if (error instanceof Error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
    return;
  }

  res.status(500).json({
    success: false,
    message: "Internal server error"
  });
};
