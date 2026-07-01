/**
 * POST /api/auth/refresh
 * Issues a new access token if the refresh token is valid.
 */
import { refreshSession, getAccessToken } from "@/lib/session";
import { apiHandler, ok, unauthorized } from "@/lib/api";

export const POST = apiHandler(async (req) => {
  const refreshed = await refreshSession();
  if (!refreshed) return unauthorized("Session expired");

  const payload = await getAccessToken();
  return ok({
    user: payload
      ? {
          id: payload.sub,
          email: payload.email,
          name: payload.name,
          role: payload.role,
        }
      : null,
  });
});
