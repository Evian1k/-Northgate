import { getCurrentUser } from "@/lib/session";
import { isDemoUser, demoLibrary } from "@/lib/demo-student-data";
import { LibraryClient } from "./LibraryClient";

export const dynamic = "force-dynamic";

export default async function LibraryPage() {
  const user = await getCurrentUser();
  if (!user) return <div>Unauthorized</div>;
  if (isDemoUser(user.id)) return <LibraryClient books={demoLibrary.books} myLoans={demoLibrary.myLoans} />;
  try {
    const { db } = await import("@/lib/db");
    const { getCurrentStudent } = await import("@/lib/student-session");
    const student = await getCurrentStudent();
    if (!student) return <div>Unauthorized</div>;
    const [books, myLoans] = await Promise.all([db.libraryBook.findMany({ orderBy: { title: "asc" }, take: 100 }), db.bookLoan.findMany({ where: { studentId: student.id, status: { in: ["ACTIVE", "OVERDUE"] } }, include: { book: true } })]);
    return <LibraryClient books={books.map((b) => ({ id: b.id, title: b.title, author: b.author, category: b.category, available: b.availableCopies > 0, availableCopies: b.availableCopies, totalCopies: b.totalCopies, coverUrl: b.coverUrl, description: b.description }))} myLoans={myLoans.map((l) => ({ id: l.id, borrowedAt: l.borrowedAt.toISOString(), dueAt: l.dueAt.toISOString(), status: l.status, book: { id: l.book.id, title: l.book.title, author: l.book.author, coverUrl: l.book.coverUrl } }))} />;
  } catch {
    return <LibraryClient books={demoLibrary.books} myLoans={demoLibrary.myLoans} />;
  }
}
