import type { JwtPayload } from "jsonwebtoken";

export interface AuthUser extends JwtPayload {
  userId: string;
  email: string;
  role: "customer" | "admin";
  isMember?: boolean;
  memberStatus?: "inactive" | "pending" | "active";
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export {};
