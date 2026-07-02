import { db } from "@/lib/db";
import { AdminList } from "@/components/admin/AdminList";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  const items = await db.contactMessage.findMany({
    orderBy: [{ createdAt: "desc" }],
    take: 200,
  });

  const rows = items.map((m) => ({
    id: m.id,
    name: m.name,
    email: m.email,
    subject: m.subject,
    message: m.message.slice(0, 80) + (m.message.length > 80 ? "…" : ""),
    status: m.status,
    createdAt: m.createdAt.toISOString(),
  }));

  return (
    <AdminList
      type="messages"
      title="Messages"
      description="Contact form submissions from website visitors."
      rows={rows}
      searchKeys={["name", "email", "subject", "message"]}
      basePath="/admin/messages"
      apiPath="/api/contact"
      canCreate={false}
      canEdit={false}
      filters={[
        {
          label: "Status",
          param: "status",
          options: [
            { label: "New", value: "NEW" },
            { label: "Read", value: "READ" },
            { label: "Replied", value: "REPLIED" },
            { label: "Archived", value: "ARCHIVED" },
          ],
        },
      ]}
    />
  );
}
