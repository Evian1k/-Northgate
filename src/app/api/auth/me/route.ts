/**
 * GET /api/auth/me
 * Returns the currently authenticated user.
 */
import { getCurrentUser } from "@/lib/session";
import { apiHandler, ok, unauthorized } from "@/lib/api";

export const GET = apiHandler(async (req) => {
  const user = await getCurrentUser();
  if (!user) return unauthorized();
  return ok({ user });
}, { requireAuth: true });
