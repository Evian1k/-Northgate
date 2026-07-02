import { db, ensureSeeded } from "@/lib/db";
import { FeesPageClient } from "./FeesPageClient";

export const dynamic = "force-dynamic";

export default async function FeesPage() {
  await ensureSeeded();
  const programmes = await db.programme.findMany({
    where: { deletedAt: null, status: "PUBLISHED" },
    orderBy: [{ qualification: "asc" }, { fee: "asc" }],
    include: { department: { select: { name: true } } },
  });

  await ensureSeeded();
  const settings = await db.siteSetting.findMany();
  const s: Record<string, string> = {};
  for (const setting of settings) s[setting.key] = setting.value;

  return (
    <FeesPageClient
      programmes={programmes.map((p) => ({
        code: p.code,
        title: p.title,
        department: p.department.name,
        qualification: p.qualification,
        duration: p.duration,
        fee: p.fee,
        currency: p.currency,
      }))}
      phone={s["site.phone"] || "+254 700 000 000"}
      email={s["site.email"] || "admissions@northgate.ac.ke"}
    />
  );
}
