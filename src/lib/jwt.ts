/**
 * JWT utilities using jose (compatible with Edge runtime + Next.js middleware).
 * Issues short-lived access tokens (15m) and long-lived refresh tokens (30d).
 */
import { SignJWT, jwtVerify } from "jose";

const ACCESS_SECRET = new TextEncoder().encode(
  process.env.JWT_ACCESS_SECRET || "dev-access-secret-change-in-production-must-be-32+chars"
);
const REFRESH_SECRET = new TextEncoder().encode(
  process.env.JWT_REFRESH_SECRET || "dev-refresh-secret-change-in-production-must-be-32+chars"
);

export const ACCESS_TOKEN_TTL = 60 * 15;          // 15 minutes
export const REFRESH_TOKEN_TTL = 60 * 60 * 24 * 30; // 30 days

export interface AccessTokenPayload {
  sub: string;
  email: string;
  role: string;
  name: string;
  type: "access";
}

export interface RefreshTokenPayload {
  sub: string;
  jti: string;
  type: "refresh";
}

export async function signAccessToken(payload: Omit<AccessTokenPayload, "type" | "iat" | "exp">) {
  return new SignJWT({ ...payload, type: "access" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${ACCESS_TOKEN_TTL}s`)
    .sign(ACCESS_SECRET);
}

export async function verifyAccessToken(token: string): Promise<AccessTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, ACCESS_SECRET);
    return payload as unknown as AccessTokenPayload;
  } catch {
    return null;
  }
}

export async function signRefreshToken(payload: Omit<RefreshTokenPayload, "type" | "iat" | "exp">) {
  return new SignJWT({ ...payload, type: "refresh" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${REFRESH_TOKEN_TTL}s`)
    .sign(REFRESH_SECRET);
}

export async function verifyRefreshToken(token: string): Promise<RefreshTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, REFRESH_SECRET);
    return payload as unknown as RefreshTokenPayload;
  } catch {
    return null;
  }
}

export function randomToken(): string {
  return crypto.randomUUID() + crypto.randomUUID().replace(/-/g, "");
}
