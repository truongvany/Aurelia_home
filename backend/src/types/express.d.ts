import type { JwtPayload } from "jsonwebtoken";

export interface AuthUser extends JwtPayload {
  userId: string;
  email: string;
  role: "customer" | "admin";
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export {};
