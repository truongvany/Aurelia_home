import type { Response } from "express";

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message = "OK",
  statusCode = 200
): void => {
  res.status(statusCode).json({
    success: true,
    message,
    data
  });
};
