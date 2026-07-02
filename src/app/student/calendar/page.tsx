import { CalendarDays } from "lucide-react";
import { StudentPageHeader } from "@/components/student/ui";
import { db } from "@/lib/db";
import { getCurrentStudent } from "@/lib/student-session";

export const dynamic = "force-dynamic";

export default async function CalendarPage() {
  const student = await getCurrentStudent();
  if (!student) return <div>Unauthorized</div>;

  const [assessments, events] = await Promise.all([
    db.assessment.findMany({
      where: {
        unit: { enrollments: { some: { studentId: student.id } } },
        dueDate: { gte: new Date() },
      },
      orderBy: { dueDate: "asc" },
      take: 20,
      include: { unit: { select: { code: true } } },
    }),
    db.event.findMany({
      where: { deletedAt: null, status: "PUBLISHED", startDate: { gte: new Date() } },
      orderBy: { startDate: "asc" },
      take: 10,
    }),
  ]);

  const items = [
    ...assessments.map((a) => ({
      id: a.id, title: a.title, type: a.type,
      date: a.dueDate.toISOString(),
      unit: a.unit.code,
      kind: "assessment" as const,
    })),
    ...events.map((e) => ({
      id: e.id, title: e.title, type: "Event",
      date: e.startDate.toISOString(),
      unit: e.location || "—",
      kind: "event" as const,
    })),
  ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div>
      <StudentPageHeader title="Calendar" subtitle="Your upcoming assessments and events" icon={CalendarDays} />

      {/* Mini calendar */}
      <MiniCalendar items={items} />

      {/* Upcoming list */}
      <div className="mt-6 rounded-3xl bg-card border border-border shadow-soft overflow-hidden">
        <div className="p-5 border-b border-border">
          <h2 className="font-display font-bold text-lg">Upcoming</h2>
        </div>
        <div className="divide-y divide-border">
          {items.length === 0 ? (
            <p className="p-8 text-center text-sm text-muted-foreground">No upcoming events.</p>
          ) : (
            items.map((item) => {
              const d = new Date(item.date);
              return (
                <div key={item.id} className="p-4 flex items-center gap-4 hover:bg-muted/30 transition-colors">
                  <div className="grid place-items-center h-12 w-12 rounded-xl bg-royal/10 flex-shrink-0">
                    <p className="font-display font-bold text-sm text-royal">{d.getDate()}</p>
                    <p className="text-[8px] uppercase text-muted-foreground">{d.toLocaleString("default", { month: "short" })}</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.type} · {item.unit}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

function MiniCalendar({ items }: { items: { date: string }[] }) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = now.getDate();
  const itemDays = new Set(items.map((i) => new Date(i.date).getDate()));

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="rounded-3xl bg-card border border-border p-5 shadow-soft">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display font-bold text-lg">{now.toLocaleString("default", { month: "long", year: "numeric" })}</h2>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <p key={i} className="text-[10px] uppercase text-muted-foreground font-bold py-1">{d}</p>
        ))}
        {cells.map((d, i) => (
          <div
            key={i}
            className={`aspect-square grid place-items-center rounded-lg text-sm relative ${
              d === today ? "gradient-royal text-white font-bold" : d ? "hover:bg-muted cursor-default" : ""
            }`}
          >
            {d}
            {d && itemDays.has(d) && d !== today && (
              <span className="absolute bottom-1 h-1 w-1 rounded-full bg-gold" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
