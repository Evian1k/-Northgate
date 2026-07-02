import { getSiteSettings } from "@/lib/data";
import { FinalCTAClient } from "./FinalCTAClient";

export async function FinalCTA() {
  const settings = await getSiteSettings();
  return (
    <FinalCTAClient
      intake={settings["admissions.intake"] || "September 2026"}
      deadline={settings["admissions.deadline"] || "15 August 2026"}
      phone={settings["site.phone"] || "+254 700 000 000"}
      email={settings["site.email"] || "admissions@northgate.ac.ke"}
    />
  );
}
