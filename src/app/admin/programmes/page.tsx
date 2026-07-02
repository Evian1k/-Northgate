import { db } from "@/lib/db";
import { AdminList } from "@/components/admin/AdminList";

export const dynamic = "force-dynamic";

export default async function AdminProgrammesPage() {
  const items = await db.programme.findMany({
    where: { deletedAt: null },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    include: { department: { select: { name: true } } },
  });

  const rows = items.map((p) => ({
    id: p.id,
    code: p.code,
    title: p.title,
    department: p.department.name,
    qualification: p.qualification,
    duration: p.duration,
    fee: p.fee,
    status: p.status,
    featured: p.featured,
  }));

  return (
    <AdminList
      type="programmes"
      title="Programmes"
      description="Manage all academic programmes across departments."
      rows={rows}
      searchKeys={["code", "title", "department"]}
      basePath="/admin/programmes"
      apiPath="/api/programmes"
      createLabel="New Programme"
      filters={[
        {
          label: "Level",
          param: "qualification",
          options: [
            { label: "Certificate", value: "Certificate" },
            { label: "Diploma", value: "Diploma" },
            { label: "Higher Diploma", value: "Higher Diploma" },
            { label: "Degree", value: "Degree" },
          ],
        },
        {
          label: "Status",
          param: "status",
          options: [
            { label: "Published", value: "PUBLISHED" },
            { label: "Draft", value: "DRAFT" },
            { label: "Archived", value: "ARCHIVED" },
          ],
        },
      ]}
    />
  );
}
