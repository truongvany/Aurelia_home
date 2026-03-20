import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

interface TokenPayload {
  userId: string;
  email: string;
  role: "customer" | "admin";
  isMember?: boolean;
  memberStatus?: "inactive" | "pending" | "active";
}

export const signAccessToken = (payload: TokenPayload): string =>
  jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"]
  });

export const signRefreshToken = (payload: TokenPayload): string =>
  jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.REFRESH_TOKEN_EXPIRES_IN as jwt.SignOptions["expiresIn"]
  });

export const verifyToken = (token: string): TokenPayload => {
  const decoded = jwt.verify(token, env.JWT_SECRET);
  if (typeof decoded === "string") {
    throw new Error("Invalid token payload");
  }
  return decoded as TokenPayload;
};
