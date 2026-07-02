import { db } from "@/lib/db";
import { AdminList } from "@/components/admin/AdminList";

export const dynamic = "force-dynamic";

export default async function AdminApplicationsPage() {
  const items = await db.application.findMany({
    orderBy: [{ createdAt: "desc" }],
    include: { programme: { select: { title: true } } },
    take: 200,
  });

  const rows = items.map((a) => ({
    id: a.id,
    reference: a.reference,
    name: `${a.firstName} ${a.lastName}`,
    email: a.email,
    programme: a.programme?.title || "—",
    status: a.status,
    createdAt: a.createdAt.toISOString(),
  }));

  return (
    <AdminList
      type="applications"
      title="Applications"
      description="Admission applications from prospective students."
      rows={rows}
      searchKeys={["reference", "name", "email", "programme"]}
      basePath="/admin/applications"
      apiPath="/api/applications"
      createLabel="New Application"
      canEdit={false}
      filters={[
        {
          label: "Status",
          param: "status",
          options: [
            { label: "Pending", value: "PENDING" },
            { label: "Reviewing", value: "REVIEWING" },
            { label: "Accepted", value: "ACCEPTED" },
            { label: "Rejected", value: "REJECTED" },
            { label: "Enrolled", value: "ENROLLED" },
          ],
        },
      ]}
    />
  );
}
