import { db } from "@/lib/db";
import { AdminList } from "@/components/admin/AdminList";

export const dynamic = "force-dynamic";

export default async function AdminEventsPage() {
  const items = await db.event.findMany({
    where: { deletedAt: null },
    orderBy: [{ startDate: "desc" }],
  });

  const rows = items.map((e) => ({
    id: e.id,
    title: e.title,
    category: e.category,
    location: e.location,
    status: e.status,
    startDate: e.startDate.toISOString(),
    registered: e.registered,
  }));

  return (
    <AdminList
      type="events"
      title="Events"
      description="Manage upcoming events, conferences, and campus activities."
      rows={rows}
      searchKeys={["title", "category", "location"]}
      basePath="/admin/events"
      apiPath="/api/events"
      createLabel="New Event"
    />
  );
}
