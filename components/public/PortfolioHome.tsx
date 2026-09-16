"use client";

import { useEffect, useState } from "react";

import { CertificationsSection } from "@/components/public/CertificationsSection";
import { ContactForm } from "@/components/public/ContactForm";
import { EducationSection } from "@/components/public/EducationSection";
import { ExperienceTimeline } from "@/components/public/ExperienceTimeline";
import { Footer } from "@/components/public/Footer";
import { Hero } from "@/components/public/Hero";
import { ProjectsSection } from "@/components/public/ProjectsSection";
import { SkillsSection } from "@/components/public/SkillsSection";
import { StatsBar } from "@/components/public/StatsBar";
import { TerminalBoot } from "@/components/public/TerminalBoot";
import { TestimonialsSection } from "@/components/public/TestimonialsSection";
import {
  isSectionVisible,
  normalizeSectionVisibility,
  type SectionVisibility,
} from "@/lib/sections";
import type {
  Certification,
  Education,
  Experience,
  Profile,
  Project,
  SiteSettings,
  Skill,
  SocialLink,
  Stat,
  Testimonial,
} from "@/lib/db/schema";

interface PortfolioHomeProps {
  profile: Profile;
  settings: SiteSettings | null;
  socialLinks: SocialLink[];
  skills: Skill[];
  projects: Project[];
  experience: Experience[];
  education: Education[];
  certifications: Certification[];
  testimonials: Testimonial[];
  stats: Stat[];
}

function wasBootSkipped() {
  return (
    typeof window !== "undefined" &&
    sessionStorage.getItem("boot-skipped") === "1"
  );
}

export function PortfolioHome({
  profile,
  settings,
  socialLinks,
  skills,
  projects,
  experience,
  education,
  certifications,
  testimonials,
  stats,
}: PortfolioHomeProps) {
  const terminalBootEnabled = settings?.terminalBootEnabled ?? true;
  const sectionVisibility: SectionVisibility = normalizeSectionVisibility(
    settings?.sectionVisibility,
  );
  const [introReady, setIntroReady] = useState(
    () => !terminalBootEnabled || wasBootSkipped(),
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!terminalBootEnabled || introReady) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [terminalBootEnabled, introReady]);

  return (
    <>
      <TerminalBoot
        name={profile.preferredName ?? profile.fullName}
        enabled={terminalBootEnabled}
        onComplete={() => setIntroReady(true)}
      />

      <Hero profile={profile} introReady={introReady} />

      {introReady && (
        <>
          {isSectionVisible(sectionVisibility, "stats") && (
            <StatsBar stats={stats} />
          )}
          {isSectionVisible(sectionVisibility, "skills") && (
            <SkillsSection skills={skills} />
          )}
          {isSectionVisible(sectionVisibility, "experience") && (
            <ExperienceTimeline experience={experience} />
          )}
          {isSectionVisible(sectionVisibility, "projects") && (
            <ProjectsSection projects={projects} />
          )}
          {isSectionVisible(sectionVisibility, "education") && (
            <EducationSection education={education} />
          )}
          {isSectionVisible(sectionVisibility, "certifications") && (
            <CertificationsSection certifications={certifications} />
          )}
          {isSectionVisible(sectionVisibility, "testimonials") && (
            <TestimonialsSection testimonials={testimonials} />
          )}
          {isSectionVisible(sectionVisibility, "contact") && (
            <ContactForm socialLinks={socialLinks} email={profile.email} />
          )}
          <Footer
            siteName={settings?.siteName ?? "Portfolio"}
            resumeUrl={profile.resumeUrl}
          />
        </>
      )}
    </>
  );
}
