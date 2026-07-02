import { db } from "@/lib/db";
import { AdminList } from "@/components/admin/AdminList";

export const dynamic = "force-dynamic";

export default async function AdminPartnersPage() {
  const items = await db.partner.findMany({
    where: { deletedAt: null },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  const rows = items.map((p) => ({
    id: p.id,
    name: p.name,
    short: p.short,
    category: p.category,
    status: p.status,
    sortOrder: p.sortOrder,
  }));

  return (
    <AdminList
      type="partners"
      title="Partners"
      description="Accreditations, government bodies, and industry partners."
      rows={rows}
      searchKeys={["name", "short"]}
      basePath="/admin/partners"
      apiPath="/api/partners"
      createLabel="New Partner"
    />
  );
}
