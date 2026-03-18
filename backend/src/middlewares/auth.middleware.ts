import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { USER_ROLES } from "../constants/roles.js";
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

export const requireRole =
  (roles: readonly string[]) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }

    if (!roles.includes(req.user.role)) {
      throw new ApiError(403, "Forbidden");
    }

    next();
  };

export const requireAdmin = requireRole([USER_ROLES.ADMIN]);
