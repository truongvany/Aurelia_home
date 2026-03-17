import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { getCurrentUser, loginUser, refreshAuthToken, registerUser } from "../services/auth.service.js";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, firstName, lastName } = req.body;
  if (!email || !password || !firstName || !lastName) {
    throw new ApiError(400, "Missing required fields");
  }

  const data = await registerUser({ email, password, firstName, lastName });
  sendSuccess(res, data, "Registered successfully", 201);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ApiError(400, "Missing email or password");
  }

  const data = await loginUser({ email, password });
  sendSuccess(res, data, "Login successful");
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    throw new ApiError(400, "Missing refreshToken");
  }

  const data = await refreshAuthToken(refreshToken);
  sendSuccess(res, data, "Token refreshed");
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user?.userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const user = await getCurrentUser(req.user.userId);
  sendSuccess(res, user, "Current user");
});
