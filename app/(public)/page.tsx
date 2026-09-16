import { PortfolioHome } from "@/components/public/PortfolioHome";
import { getPortfolioData } from "@/lib/db/queries";

export const revalidate = 3600;

export default async function HomePage() {
  const data = await getPortfolioData();

  if (data.settings?.maintenanceMode) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="font-mono text-cyan-400">$ system status</p>
          <h1 className="mt-4 text-2xl font-bold text-white">Under Maintenance</h1>
          <p className="mt-2 text-slate-400">Be back soon.</p>
        </div>
      </div>
    );
  }

  if (!data.profile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="font-mono text-cyan-400">$ portfolio init</p>
          <h1 className="mt-4 text-2xl font-bold text-white">Portfolio Not Configured</h1>
          <p className="mt-2 text-slate-400">
            Set up your database and visit{" "}
            <a href="/admin/login" className="text-cyan-400 hover:underline">
              /admin/login
            </a>{" "}
            to add content.
          </p>
        </div>
      </div>
    );
  }

  return (
    <PortfolioHome
      profile={data.profile}
      settings={data.settings}
      socialLinks={data.socialLinks}
      skills={data.skills}
      projects={data.projects}
      experience={data.experience}
      education={data.education}
      certifications={data.certifications}
      testimonials={data.testimonials}
      stats={data.stats}
    />
  );
}
