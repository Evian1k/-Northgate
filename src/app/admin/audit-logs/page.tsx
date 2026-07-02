import { db } from "@/lib/db";
import { AdminList } from "@/components/admin/AdminList";

export const dynamic = "force-dynamic";

export default async function AdminAuditLogsPage() {
  const items = await db.auditLog.findMany({
    orderBy: [{ createdAt: "desc" }],
    take: 200,
    include: { user: { select: { name: true, email: true } } },
  });

  const rows = items.map((a) => ({
    id: a.id,
    action: a.action,
    resource: a.resource,
    resourceId: a.resourceId,
    user: a.user?.name || a.user?.email || "System",
    ip: a.ip,
    createdAt: a.createdAt.toISOString(),
  }));

  return (
    <AdminList
      type="audit-logs"
      title="Audit Logs"
      description="System activity log for security and compliance."
      rows={rows}
      searchKeys={["action", "resource", "user"]}
      basePath="/admin/audit-logs"
      apiPath="/api/audit-logs"
      canCreate={false}
      canEdit={false}
      canDelete={false}
    />
  );
}
