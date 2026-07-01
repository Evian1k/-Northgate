import { getSiteSettings } from "@/lib/data";
import { FooterClient } from "./FooterClient";

export async function Footer() {
  const settings = await getSiteSettings();
  return (
    <FooterClient
      siteName={settings["site.name"] || "Northgate Institute of Technology"}
      phone={settings["site.phone"] || "+254 700 000 000"}
      email={settings["site.email"] || "info@northgate.ac.ke"}
      address={settings["site.address"] || "Nairobi, Kenya"}
    />
  );
}
