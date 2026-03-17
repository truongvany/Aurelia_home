import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";

export const requireAuth = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    throw new ApiError(401, "Missing or invalid authorization header");
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, env.JWT_SECRET);
    if (typeof payload === "string") {
      throw new ApiError(401, "Invalid token payload");
    }
    req.user = payload as Express.Request["user"];
    next();
  } catch {
    throw new ApiError(401, "Invalid or expired token");
  }
};
