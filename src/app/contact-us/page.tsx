import { db, ensureSeeded } from "@/lib/db";
import { ContactPageClient } from "./ContactPageClient";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  await ensureSeeded();
  const settings = await db.siteSetting.findMany();
  const s: Record<string, string> = {};
  for (const setting of settings) s[setting.key] = setting.value;

  return (
    <ContactPageClient
      siteName={s["site.name"] || "Northgate Institute of Technology"}
      phone={s["site.phone"] || "+254 700 000 000"}
      email={s["site.email"] || "admissions@northgate.ac.ke"}
      address={s["site.address"] || "Nairobi, Kenya"}
    />
  );
}
