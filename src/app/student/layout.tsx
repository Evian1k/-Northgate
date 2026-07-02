import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { StudentPortalShell } from "@/components/student/StudentPortalShell";
import { demoUsers, getDemoStudentStats } from "@/lib/demo-data";

export const dynamic = "force-dynamic";

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/student/login");
  if (user.role !== "STUDENT" && user.role !== "ADMIN") redirect("/student/login?error=forbidden");

  // For demo users, use hardcoded data — no DB needed
  const isDemo = user.id.startsWith("demo-");

  const studentInfo = isDemo
    ? (() => {
        const account = Object.keys(demoUsers).find((k) => demoUsers[k].id === user.id);
        const stats = getDemoStudentStats(account || "student1");
        const demoUser = demoUsers[account || "student1"];
        return {
          name: demoUser.name,
          email: demoUser.email,
          admissionNo: demoUser.admissionNo || "—",
          programme: demoUser.programme || "—",
          profileImageUrl: demoUser.profileImageUrl,
          unreadCount: 3,
        };
      })()
    : await (async () => {
        // Real student — query DB
        const { db } = await import("@/lib/db");
        const student = await db.student.findFirst({
          where: { userId: user.id },
          include: { programme: { select: { title: true } } },
        });
        if (!student) redirect("/student/login?error=forbidden");
        const unreadCount = await db.notification.count({
          where: { studentId: student.id, readAt: null },
        });
        return {
          name: user.name,
          email: user.email,
          admissionNo: student.admissionNo,
          programme: student.programme?.title || "—",
          profileImageUrl: student.profileImageUrl,
          unreadCount,
        };
      })();

  return (
    <StudentPortalShell student={studentInfo} unreadCount={studentInfo.unreadCount}>
      {children}
    </StudentPortalShell>
  );
}
