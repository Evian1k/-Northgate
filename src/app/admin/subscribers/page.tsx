import { db } from "@/lib/db";
import { AdminList } from "@/components/admin/AdminList";

export const dynamic = "force-dynamic";

export default async function AdminSubscribersPage() {
  const items = await db.newsletterSubscriber.findMany({
    orderBy: [{ createdAt: "desc" }],
    take: 500,
  });

  const rows = items.map((s) => ({
    id: s.id,
    email: s.email,
    status: s.status,
    createdAt: s.createdAt.toISOString(),
  }));

  return (
    <AdminList
      type="subscribers"
      title="Newsletter Subscribers"
      description="Email addresses subscribed to the Northgate newsletter."
      rows={rows}
      searchKeys={["email"]}
      basePath="/admin/subscribers"
      apiPath="/api/newsletter"
      canCreate={false}
      canEdit={false}
      filters={[
        {
          label: "Status",
          param: "status",
          options: [
            { label: "Active", value: "ACTIVE" },
            { label: "Unsubscribed", value: "UNSUBSCRIBED" },
            { label: "Bounced", value: "BOUNCED" },
          ],
        },
      ]}
    />
  );
}
