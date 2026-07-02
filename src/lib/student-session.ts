/**
 * Student session helpers — get current student profile.
 */
import { getCurrentUser } from "@/lib/session";
import { db, ensureSeeded } from "@/lib/db";

export async function getCurrentStudent() {
  await ensureSeeded();
  const user = await getCurrentUser();
  if (!user) return null;
  if (user.role !== "STUDENT" && user.role !== "ADMIN") return null;
  const student = await db.student.findFirst({
    where: { userId: user.id },
    include: {
      programme: { select: { id: true, title: true, code: true, qualification: true } },
      user: { select: { id: true, name: true, email: true, phone: true, image: true } },
    },
  });
  return student;
}

export async function requireStudent() {
  const student = await getCurrentStudent();
  if (!student) {
    const err = new Error("Unauthorized");
    (err as any).status = 401;
    throw err;
  }
  return student;
}
