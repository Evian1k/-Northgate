/**
 * POST /api/auth/refresh
 * Issues a new access token from a refresh token.
 * For demo users, this just re-signs a new access token.
 */
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

const ACCESS_SECRET = new TextEncoder().encode(
  process.env.JWT_ACCESS_SECRET || "dev-access-secret-change-in-production-must-be-32+chars"
);
const REFRESH_SECRET = new TextEncoder().encode(
  process.env.JWT_REFRESH_SECRET || "dev-refresh-secret-change-in-production-must-be-32+chars"
);

const ACCESS_TOKEN_TTL = 60 * 15;

function cookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}

export async function POST() {
  try {
    const jar = await cookies();
    const refreshToken = jar.get("ng_refresh")?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { success: false, error: "No refresh token" },
        { status: 401 }
      );
    }

    // Verify refresh token
    let payload: any;
    try {
      const verified = await jwtVerify(refreshToken, REFRESH_SECRET);
      payload = verified.payload;
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid refresh token" },
        { status: 401 }
      );
    }

    // Sign new access token
    const access = await new SignJWT({
      sub: payload.sub,
      email: payload.email || "",
      role: payload.role || "STUDENT",
      name: payload.name || "User",
      type: "access",
    })
      .setProtectedHeader({ alg: "HS256" })
      .setSubject(payload.sub as string)
      .setIssuedAt()
      .setExpirationTime(`${ACCESS_TOKEN_TTL}s`)
      .sign(ACCESS_SECRET);

    jar.set("ng_access", access, cookieOptions(ACCESS_TOKEN_TTL));

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: payload.sub,
          email: payload.email,
          name: payload.name,
          role: payload.role,
        },
      },
    });
  } catch (e: any) {
    return NextResponse.json(
      { success: false, error: e?.message || "Refresh failed" },
      { status: 500 }
    );
  }
}
