import { getCurrentUser } from "@/lib/session";
import { isDemoUser, demoMessages } from "@/lib/demo-student-data";
import { MessagesClient } from "./MessagesClient";

export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  const user = await getCurrentUser();
  if (!user) return <div>Unauthorized</div>;
  if (isDemoUser(user.id)) return <MessagesClient inbox={demoMessages.map((m) => ({ ...m, fromEmail: null }))} sent={[]} />;
  try {
    const { db } = await import("@/lib/db");
    const { getCurrentStudent } = await import("@/lib/student-session");
    const student = await getCurrentStudent();
    if (!student) return <div>Unauthorized</div>;
    const [inbox, sent] = await Promise.all([db.message.findMany({ where: { toStudentId: student.id }, orderBy: { createdAt: "desc" }, include: { fromUser: { select: { name: true, email: true } } }, take: 100 }), db.message.findMany({ where: { fromStudentId: student.id }, orderBy: { createdAt: "desc" }, take: 100 })]);
    return <MessagesClient inbox={inbox.map((m) => ({ id: m.id, subject: m.subject, body: m.body, readAt: m.readAt?.toISOString() || null, createdAt: m.createdAt.toISOString(), from: m.fromUser?.name || "System", fromEmail: m.fromUser?.email }))} sent={sent.map((m) => ({ id: m.id, subject: m.subject, body: m.body, createdAt: m.createdAt.toISOString() }))} />;
  } catch {
    return <MessagesClient inbox={demoMessages.map((m) => ({ ...m, fromEmail: null }))} sent={[]} />;
  }
}
