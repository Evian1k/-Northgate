/**
 * POST /api/auth/demo-login
 * One-click login for demo accounts. NO DATABASE NEEDED.
 * Sets JWT cookies directly using hardcoded demo user data.
 */
import { setSessionCookies, getRequestIp } from "@/lib/session";
import { apiHandler, parseBody, ok, fail } from "@/lib/api";
import { demoAccounts, demoUsers } from "@/lib/demo-data";
import { z } from "zod";

const schema = z.object({
  account: z.string().min(1),
});

export const POST = apiHandler(async (req, ctx) => {
  const body = await parseBody(req);
  const { account } = schema.parse(body);

  const email = demoAccounts[account];
  if (!email) return fail("Invalid demo account", 400);

  const demoUser = demoUsers[account];
  if (!demoUser) return fail("Demo account not found", 404);

  // Set session cookies directly — NO database query needed
  await setSessionCookies(demoUser.id, demoUser.email, demoUser.role, demoUser.name, {
    ip: ctx.ip,
    userAgent: ctx.userAgent,
  });

  const redirectTo =
    demoUser.role === "ADMIN" || demoUser.role === "EDITOR" ? "/admin" : "/student/dashboard";

  return ok({
    user: {
      id: demoUser.id,
      email: demoUser.email,
      name: demoUser.name,
      role: demoUser.role,
    },
    redirectTo,
  });
});
