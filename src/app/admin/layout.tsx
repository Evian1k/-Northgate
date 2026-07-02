import { redirect } from "next/navigation";
import { ensureSeeded } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { AdminShell } from "@/components/admin/AdminShell";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await ensureSeeded();
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  if (user.role !== "ADMIN" && user.role !== "EDITOR") redirect("/admin/login?error=forbidden");

  return (
    <AdminShell user={{ name: user.name, email: user.email, role: user.role }}>
      {children}
    </AdminShell>
  );
}
