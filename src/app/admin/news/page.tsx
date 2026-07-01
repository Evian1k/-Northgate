import { db } from "@/lib/db";
import { AdminList } from "@/components/admin/AdminList";

export const dynamic = "force-dynamic";

export default async function AdminNewsPage() {
  const items = await db.news.findMany({
    where: { deletedAt: null },
    orderBy: [{ createdAt: "desc" }],
    include: { author: { select: { name: true } } },
  });

  const rows = items.map((n) => ({
    id: n.id,
    title: n.title,
    category: n.category,
    author: n.author?.name || "—",
    status: n.status,
    views: n.views,
    publishedAt: n.publishedAt?.toISOString() || null,
  }));

  return (
    <AdminList
      type="news"
      title="News & Articles"
      description="Publish news, announcements, and editorial content."
      rows={rows}
      searchKeys={["title", "category"]}
      basePath="/admin/news"
      apiPath="/api/news"
      createLabel="New Article"
      filters={[
        {
          label: "Category",
          param: "category",
          options: [
            { label: "Latest News", value: "Latest News" },
            { label: "Research", value: "Research" },
            { label: "Innovation", value: "Innovation" },
            { label: "Conferences", value: "Conferences" },
          ],
        },
        {
          label: "Status",
          param: "status",
          options: [
            { label: "Published", value: "PUBLISHED" },
            { label: "Draft", value: "DRAFT" },
            { label: "Scheduled", value: "SCHEDULED" },
            { label: "Archived", value: "ARCHIVED" },
          ],
        },
      ]}
    />
  );
}
