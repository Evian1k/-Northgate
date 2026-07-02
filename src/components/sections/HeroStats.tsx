import { db } from "@/lib/db";
import { getSiteSettings } from "@/lib/data";

export async function HeroStats() {
  const settings = await getSiteSettings();
  const stats = [
    { value: Number(settings["stats.students"] || 9000), suffix: "+", label: "Students", decimals: 0 },
    { value: Number(settings["stats.programmes"] || 150), suffix: "+", label: "Programmes", decimals: 0 },
    { value: Number(settings["stats.employability"] || 96), suffix: "%", label: "Graduate Employability", decimals: 0 },
    { value: Number(settings["stats.years"] || 60), suffix: "+", label: "Years of Excellence", decimals: 0 },
  ];

  // Import the client counter lazily
  const { HeroStatsClient } = await import("./HeroStatsClient");
  return <HeroStatsClient stats={stats} />;
}
