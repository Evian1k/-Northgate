/**
 * POST /api/auth/demo-login
 * One-click login for demo accounts. Accepts { role: "admin" | "editor" | "student1" | ... | "student6" }
 * Sets session cookies and returns the user.
 *
 * In production, this endpoint should be disabled or rate-limited heavily.
 */
import { db } from "@/lib/db";
import { setSessionCookies, getRequestIp } from "@/lib/session";
import { apiHandler, parseBody, ok, fail } from "@/lib/api";
import { audit } from "@/lib/audit";
import { z } from "zod";

const demoAccounts: Record<string, string> = {
  admin: "admin@northgate.ac.ke",
  editor: "editor@northgate.ac.ke",
  student1: "student@northgate.ac.ke",
  student2: "mary.student@northgate.ac.ke",
  student3: "brian.student@northgate.ac.ke",
  student4: "grace.student@northgate.ac.ke",
  student5: "david.student@northgate.ac.ke",
  student6: "faith.student@northgate.ac.ke",
};

const schema = z.object({
  account: z.string().min(1),
});

export const POST = apiHandler(async (req, ctx) => {
  const body = await parseBody(req);
  const { account } = schema.parse(body);

  const email = demoAccounts[account];
  if (!email) return fail("Invalid demo account", 400);

  // Demo login is always enabled for this project (client demo)
  // To disable in a real production deployment, set ENABLE_DEMO_LOGIN=false
  if (process.env.ENABLE_DEMO_LOGIN === "false") {
    return fail("Demo login is disabled", 403);
  }

  const user = await db.user.findFirst({
    where: { emailNormalized: email, deletedAt: null, status: "ACTIVE" },
  });

  if (!user) return fail("Demo account not found. The database may still be initializing — please try again in a moment.", 404);

  await db.user.update({
    where: { id: user.id },
    data: {
      lastLoginAt: new Date(),
      lastLoginIp: ctx.ip,
      failedLoginAttempts: 0,
      lockedUntil: null,
    },
  });

  await setSessionCookies(user.id, user.email, user.role, user.name, {
    ip: ctx.ip,
    userAgent: ctx.userAgent,
  });

  await audit({
    userId: user.id,
    action: "DEMO_LOGIN",
    resource: "User",
    resourceId: user.id,
    ip: ctx.ip,
    userAgent: ctx.userAgent,
    metadata: { account },
  });

  const redirectTo =
    user.role === "ADMIN" || user.role === "EDITOR" ? "/admin" : "/student/dashboard";

  return ok({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    redirectTo,
  });
});
