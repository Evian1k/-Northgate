/**
 * POST /api/auth/demo-login
 * One-click login for demo accounts. ZERO database dependency.
 * This route does NOT use apiHandler and does NOT touch the database.
 * It just sets JWT cookies and returns.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SignJWT } from "jose";
import { demoAccounts, demoUsers } from "@/lib/demo-data";

const ACCESS_SECRET = new TextEncoder().encode(
  process.env.JWT_ACCESS_SECRET || "dev-access-secret-change-in-production-must-be-32+chars"
);
const REFRESH_SECRET = new TextEncoder().encode(
  process.env.JWT_REFRESH_SECRET || "dev-refresh-secret-change-in-production-must-be-32+chars"
);

const ACCESS_TOKEN_TTL = 60 * 15; // 15 minutes
const REFRESH_TOKEN_TTL = 60 * 60 * 24 * 30; // 30 days

function cookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { account } = body;

    if (!account) {
      return NextResponse.json(
        { success: false, error: "Account is required" },
        { status: 400 }
      );
    }

    const email = demoAccounts[account];
    if (!email) {
      return NextResponse.json(
        { success: false, error: "Invalid demo account" },
        { status: 400 }
      );
    }

    const demoUser = demoUsers[account];
    if (!demoUser) {
      return NextResponse.json(
        { success: false, error: "Demo account not found" },
        { status: 404 }
      );
    }

    // Sign access JWT directly — no DB needed
    const access = await new SignJWT({
      sub: demoUser.id,
      email: demoUser.email,
      role: demoUser.role,
      name: demoUser.name,
      type: "access",
    })
      .setProtectedHeader({ alg: "HS256" })
      .setSubject(demoUser.id)
      .setIssuedAt()
      .setExpirationTime(`${ACCESS_TOKEN_TTL}s`)
      .sign(ACCESS_SECRET);

    // Sign refresh JWT
    const refresh = await new SignJWT({
      sub: demoUser.id,
      jti: crypto.randomUUID() + crypto.randomUUID().replace(/-/g, ""),
      type: "refresh",
    })
      .setProtectedHeader({ alg: "HS256" })
      .setSubject(demoUser.id)
      .setIssuedAt()
      .setExpirationTime(`${REFRESH_TOKEN_TTL}s`)
      .sign(REFRESH_SECRET);

    // Set cookies
    const jar = await cookies();
    jar.set("ng_access", access, cookieOptions(ACCESS_TOKEN_TTL));
    jar.set("ng_refresh", refresh, cookieOptions(REFRESH_TOKEN_TTL));

    const redirectTo =
      demoUser.role === "ADMIN" || demoUser.role === "EDITOR"
        ? "/admin"
        : "/student/dashboard";

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: demoUser.id,
          email: demoUser.email,
          name: demoUser.name,
          role: demoUser.role,
        },
        redirectTo,
      },
    });
  } catch (e: any) {
    console.error("[demo-login] Error:", e);
    return NextResponse.json(
      { success: false, error: e?.message || "Login failed" },
      { status: 500 }
    );
  }
}
