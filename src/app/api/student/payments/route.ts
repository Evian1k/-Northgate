import { db } from "@/lib/db";
import { apiHandler, ok, unauthorized } from "@/lib/api";
import { getCurrentStudent } from "@/lib/student-session";

export const dynamic = "force-dynamic";

export const GET = apiHandler(async (req) => {
  const student = await getCurrentStudent();
  if (!student) return unauthorized();

  const payments = await db.payment.findMany({
    where: { studentId: student.id },
    orderBy: { paidAt: "desc" },
    include: { fee: { select: { type: true } } },
    take: 100,
  });

  return ok(payments.map((p) => ({
    id: p.id,
    amount: p.amount,
    method: p.method,
    reference: p.reference,
    paidAt: p.paidAt.toISOString(),
    feeType: p.fee.type,
  })));
});
