/**
 * POST /api/auth/logout
 * Clears session cookies. No DB needed.
 */
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const jar = await cookies();
    jar.delete("ng_access");
    jar.delete("ng_refresh");
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json(
      { success: false, error: e?.message || "Logout failed" },
      { status: 500 }
    );
  }
}
