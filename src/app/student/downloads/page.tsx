import { Download, FileText, File, Image as ImageIcon, BookOpen, Calendar } from "lucide-react";
import { StudentPageHeader, EmptyState } from "@/components/student/ui";

export const dynamic = "force-dynamic";

const downloads = [
  { name: "2026 Academic Calendar", type: "PDF", size: "2.4 MB", category: "Calendar", icon: Calendar },
  { name: "Student Handbook 2026", type: "PDF", size: "8.1 MB", category: "Handbook", icon: FileText },
  { name: "Exam Timetable — Semester 1", type: "PDF", size: "1.2 MB", category: "Exams", icon: FileText },
  { name: "Fee Structure 2026", type: "PDF", size: "0.8 MB", category: "Finance", icon: FileText },
  { name: "Programme Brochure — Engineering", type: "PDF", size: "4.5 MB", category: "Brochure", icon: BookOpen },
  { name: "Campus Map", type: "PNG", size: "3.2 MB", category: "Maps", icon: ImageIcon },
  { name: "Library Rules & Regulations", type: "PDF", size: "0.5 MB", category: "Library", icon: FileText },
  { name: "Hostel Application Form", type: "PDF", size: "0.3 MB", category: "Forms", icon: File },
];

export default function DownloadsPage() {
  return (
    <div>
      <StudentPageHeader title="Downloads" subtitle="Important documents and forms" icon={Download} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {downloads.map((d, i) => (
          <div key={i} className="rounded-2xl bg-card border border-border p-5 shadow-soft hover:shadow-premium transition-shadow group">
            <div className="flex items-start gap-3">
              <div className="grid place-items-center h-11 w-11 rounded-xl bg-royal/10 flex-shrink-0">
                <d.icon className="h-5 w-5 text-royal" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm leading-snug">{d.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{d.category} · {d.type} · {d.size}</p>
              </div>
            </div>
            <button className="mt-4 w-full inline-flex items-center justify-center gap-1.5 rounded-full bg-muted hover:bg-royal hover:text-white text-sm font-medium py-2 transition-colors">
              <Download className="h-3.5 w-3.5" /> Download
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
