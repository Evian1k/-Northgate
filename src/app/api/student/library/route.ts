import { db } from "@/lib/db";
import { apiHandler, ok, unauthorized } from "@/lib/api";
import { getCurrentStudent } from "@/lib/student-session";

export const dynamic = "force-dynamic";

export const GET = apiHandler(async (req) => {
  const student = await getCurrentStudent();
  if (!student) return unauthorized();

  const url = new URL(req.url);
  const search = url.searchParams.get("q");

  const where: any = {};
  if (search) {
    where.OR = [
      { title: { contains: search } },
      { author: { contains: search } },
    ];
  }

  const books = await db.libraryBook.findMany({
    where,
    orderBy: { title: "asc" },
    take: 100,
  });

  const myLoans = await db.bookLoan.findMany({
    where: { studentId: student.id, status: { in: ["ACTIVE", "OVERDUE"] } },
    include: { book: true },
  });

  return ok({
    books: books.map((b) => ({
      id: b.id,
      title: b.title,
      author: b.author,
      category: b.category,
      available: b.availableCopies > 0,
      availableCopies: b.availableCopies,
      totalCopies: b.totalCopies,
      coverUrl: b.coverUrl,
    })),
    myLoans: myLoans.map((l) => ({
      id: l.id,
      borrowedAt: l.borrowedAt.toISOString(),
      dueAt: l.dueAt.toISOString(),
      status: l.status,
      book: {
        id: l.book.id,
        title: l.book.title,
        author: l.book.author,
        coverUrl: l.book.coverUrl,
      },
    })),
  });
});
