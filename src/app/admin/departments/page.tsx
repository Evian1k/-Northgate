import { db } from "@/lib/db";
import { AdminList } from "@/components/admin/AdminList";

export const dynamic = "force-dynamic";

export default async function AdminDepartmentsPage() {
  const items = await db.department.findMany({
    where: { deletedAt: null },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    include: { _count: { select: { programmes: { where: { deletedAt: null } } } } },
  });

  const rows = items.map((d) => ({
    id: d.id,
    name: d.name,
    tagline: d.tagline,
    status: d.status,
    programmes: d._count.programmes,
    createdAt: d.createdAt.toISOString(),
  }));

  return (
    <AdminList
      type="departments"
      title="Departments"
      description="Manage academic departments displayed on the homepage."
      rows={rows}
      searchKeys={["name", "tagline"]}
      basePath="/admin/departments"
      apiPath="/api/departments"
      createLabel="New Department"
    />
  );
}
