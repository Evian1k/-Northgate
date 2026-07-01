/**
 * Audit logs API
 * GET /api/audit-logs — admin only
 */
import { db } from "@/lib/db";
import { apiHandler, ok } from "@/lib/api";

export const GET = apiHandler(async (req) => {
  const url = new URL(req.url);
  const action = url.searchParams.get("action");
  const resource = url.searchParams.get("resource");
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "50"), 200);

  const where: any = {};
  if (action) where.action = action;
  if (resource) where.resource = resource;

  const items = await db.auditLog.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { user: { select: { id: true, name: true, email: true } } },
    take: limit,
  });
  return ok(items);
}, { requireAuth: true, roles: ["ADMIN"] });
