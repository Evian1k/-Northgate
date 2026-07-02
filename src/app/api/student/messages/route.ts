import { db } from "@/lib/db";
import { apiHandler, ok, unauthorized, parseBody } from "@/lib/api";
import { getCurrentStudent } from "@/lib/student-session";

export const dynamic = "force-dynamic";

export const GET = apiHandler(async (req) => {
  const student = await getCurrentStudent();
  if (!student) return unauthorized();

  const url = new URL(req.url);
  const folder = url.searchParams.get("folder") || "inbox"; // inbox | sent

  const where: any =
    folder === "sent"
      ? { fromStudentId: student.id }
      : { toStudentId: student.id };

  const messages = await db.message.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      fromUser: { select: { name: true, email: true } },
      fromStudent: { include: { user: { select: { name: true } } } },
    },
    take: 100,
  });

  return ok(messages.map((m) => ({
    id: m.id,
    subject: m.subject,
    body: m.body,
    readAt: m.readAt?.toISOString() || null,
    createdAt: m.createdAt.toISOString(),
    from: m.fromUser?.name || m.fromStudent?.user.name || "System",
    fromEmail: m.fromUser?.email,
  })));
});

// Send a message to admin/support
export const POST = apiHandler(async (req) => {
  const student = await getCurrentStudent();
  if (!student) return unauthorized();

  const body = await parseBody(req);
  const { subject, body: messageBody } = body;

  const admins = await db.user.findMany({
    where: { role: "ADMIN", status: "ACTIVE", deletedAt: null },
    take: 1,
  });

  const message = await db.message.create({
    data: {
      fromStudentId: student.id,
      fromUserId: admins[0]?.id,
      subject,
      body: messageBody,
    },
  });

  return ok({ id: message.id, success: true });
});
