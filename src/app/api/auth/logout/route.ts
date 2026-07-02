/**
 * POST /api/auth/logout
 * Revokes the current refresh token and clears cookies.
 */
import { db } from "@/lib/db";
import { clearSessionCookies, getAccessToken } from "@/lib/session";
import { verifyRefreshToken } from "@/lib/jwt";
import { apiHandler, ok } from "@/lib/api";
import { cookies } from "next/headers";
import { audit } from "@/lib/audit";

export const POST = apiHandler(async (req, ctx) => {
  const payload = await getAccessToken();
  const jar = await cookies();
  const refresh = jar.get("ng_refresh")?.value;

  if (refresh) {
    const rt = await verifyRefreshToken(refresh);
    if (rt) {
      await db.refreshToken.updateMany({
        where: { token: rt.jti, userId: rt.sub },
        data: { revokedAt: new Date() },
      });
    }
  }

  await clearSessionCookies();

  if (payload) {
    await audit({
      userId: payload.sub,
      action: "LOGOUT",
      resource: "User",
      resourceId: payload.sub,
      ip: ctx.ip,
      userAgent: ctx.userAgent,
    });
  }

  return ok({ success: true });
});
