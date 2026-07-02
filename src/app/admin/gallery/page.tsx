import { db } from "@/lib/db";
import { AdminList } from "@/components/admin/AdminList";

export const dynamic = "force-dynamic";

export default async function AdminGalleryPage() {
  const items = await db.galleryImage.findMany({
    where: { deletedAt: null },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  const rows = items.map((g) => ({
    id: g.id,
    title: g.title,
    alt: g.alt,
    category: g.category,
    status: g.status,
    sortOrder: g.sortOrder,
  }));

  return (
    <AdminList
      type="gallery"
      title="Photo Gallery"
      description="Campus life, workshops, labs, and ceremony photos."
      rows={rows}
      searchKeys={["title", "alt", "category"]}
      basePath="/admin/gallery"
      apiPath="/api/gallery"
      createLabel="New Image"
    />
  );
}
