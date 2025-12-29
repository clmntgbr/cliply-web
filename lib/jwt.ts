import jwt from "jsonwebtoken";

export interface JWTPayload {
  email?: string;
  roles?: string[];
  id?: string;
  firstname?: string;
  lastname?: string;
  sub?: string;
  [key: string]: unknown;
}

export function decodeToken(token: string): JWTPayload | null {
  try {
    return jwt.decode(token) as JWTPayload;
  } catch {
    return null;
  }
}

export function verifyToken(token: string, secret?: string): JWTPayload | null {
  if (!secret) {
    return decodeToken(token);
  }

  try {
    return jwt.verify(token, secret) as JWTPayload;
  } catch {
    return null;
  }
}
