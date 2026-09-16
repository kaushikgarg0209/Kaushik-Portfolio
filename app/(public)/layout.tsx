import { Navbar } from "@/components/public/Navbar";
import { normalizeSectionVisibility } from "@/lib/sections";
import { getSiteSettings } from "@/lib/db/queries";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let siteName = "Portfolio";
  let sectionVisibility = normalizeSectionVisibility(undefined);

  try {
    const settings = await getSiteSettings();
    siteName = settings?.siteName ?? "Portfolio";
    sectionVisibility = normalizeSectionVisibility(settings?.sectionVisibility);
  } catch {
    // DB not configured yet
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Navbar siteName={siteName} sectionVisibility={sectionVisibility} />
      {children}
    </div>
  );
}
