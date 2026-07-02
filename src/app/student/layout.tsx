import { redirect } from "next/navigation";
import { db, ensureSeeded } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { StudentPortalShell } from "@/components/student/StudentPortalShell";

export const dynamic = "force-dynamic";

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  await ensureSeeded();
  const user = await getCurrentUser();
  if (!user) redirect("/student/login");
  if (user.role !== "STUDENT" && user.role !== "ADMIN") redirect("/student/login?error=forbidden");

  const student = await db.student.findFirst({
    where: { userId: user.id },
    include: { programme: { select: { title: true } } },
  });
  if (!student) redirect("/student/login?error=forbidden");

  const unreadCount = await db.notification.count({
    where: { studentId: student.id, readAt: null },
  });

  return (
    <StudentPortalShell
      student={{
        name: user.name,
        email: user.email,
        admissionNo: student.admissionNo,
        programme: student.programme?.title || "—",
        profileImageUrl: student.profileImageUrl,
      }}
      unreadCount={unreadCount}
    >
      {children}
    </StudentPortalShell>
  );
}
