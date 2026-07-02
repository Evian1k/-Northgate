import { getPublishedPartners } from "@/lib/data";
import { PartnersClient } from "./PartnersClient";

export async function Partners() {
  const partners = await getPublishedPartners();
  const mapped = partners.map((p) => ({
    name: p.name,
    short: p.short,
    category: p.category,
  }));
  return <PartnersClient partners={mapped} />;
}
