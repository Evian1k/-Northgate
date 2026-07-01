import { getSiteSettings } from "@/lib/data";
import { HeroClient } from "./HeroClient";

export async function Hero() {
  const settings = await getSiteSettings();
  const stats = [
    { value: Number(settings["stats.students"] || 9000), suffix: "+", label: "Students", decimals: 0 },
    { value: Number(settings["stats.programmes"] || 150), suffix: "+", label: "Programmes", decimals: 0 },
    { value: Number(settings["stats.employability"] || 96), suffix: "%", label: "Graduate Employability", decimals: 0 },
    { value: Number(settings["stats.years"] || 60), suffix: "+", label: "Years of Excellence", decimals: 0 },
  ];

  return (
    <HeroClient
      stats={stats}
      admissionsIntake={settings["admissions.intake"] || "September 2026"}
      admissionsDeadline={settings["admissions.deadline"] || "15 August 2026"}
    />
  );
}
