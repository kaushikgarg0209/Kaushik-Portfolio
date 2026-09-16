import type { MetadataRoute } from "next";

import { getSiteSettings } from "@/lib/db/queries";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const settings = await getSiteSettings();

  return {
    name: settings?.siteName ?? "Portfolio",
    short_name: settings?.siteName ?? "Portfolio",
    description: settings?.metaDescription ?? "Developer portfolio",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0f",
    theme_color: "#00d4ff",
  };
}
