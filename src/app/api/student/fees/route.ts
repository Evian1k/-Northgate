import { db } from "@/lib/db";
import { apiHandler, ok, unauthorized } from "@/lib/api";
import { getCurrentStudent } from "@/lib/student-session";

export const dynamic = "force-dynamic";

export const GET = apiHandler(async (req) => {
  const student = await getCurrentStudent();
  if (!student) return unauthorized();

  const fees = await db.fee.findMany({
    where: { studentId: student.id },
    orderBy: { dueDate: "asc" },
    include: {
      payments: { orderBy: { paidAt: "desc" } },
      semester: { select: { name: true } },
    },
  });

  const totalBilled = fees.reduce((s, f) => s + f.amount, 0);
  const totalPaid = fees.reduce((s, f) => s + f.payments.reduce((ss, p) => ss + p.amount, 0), 0);
  const balance = totalBilled - totalPaid;

  return ok({
    totalBilled,
    totalPaid,
    balance,
    fees: fees.map((f) => ({
      id: f.id,
      type: f.type,
      amount: f.amount,
      dueDate: f.dueDate.toISOString(),
      status: f.status,
      semester: f.semester?.name || "—",
      paid: f.payments.reduce((s, p) => s + p.amount, 0),
      payments: f.payments.map((p) => ({
        id: p.id,
        amount: p.amount,
        method: p.method,
        reference: p.reference,
        paidAt: p.paidAt.toISOString(),
      })),
    })),
  });
});
