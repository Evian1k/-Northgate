import { db } from "@/lib/db";
import { AdminList } from "@/components/admin/AdminList";

export const dynamic = "force-dynamic";

export default async function AdminTestimonialsPage() {
  const items = await db.testimonial.findMany({
    where: { deletedAt: null },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  const rows = items.map((t) => ({
    id: t.id,
    name: t.name,
    role: t.role,
    type: t.type,
    org: t.org,
    rating: t.rating,
    status: t.status,
  }));

  return (
    <AdminList
      type="testimonials"
      title="Testimonials"
      description="Student, employer, and graduate success stories."
      rows={rows}
      searchKeys={["name", "role", "org"]}
      basePath="/admin/testimonials"
      apiPath="/api/testimonials"
      createLabel="New Testimonial"
    />
  );
}
