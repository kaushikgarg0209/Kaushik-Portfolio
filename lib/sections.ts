export const PORTFOLIO_SECTIONS = [
  { key: "stats", label: "Stats Bar", navHref: "#stats" },
  { key: "skills", label: "Skills & Tech", navHref: "#skills" },
  { key: "experience", label: "Experience", navHref: "#experience" },
  { key: "projects", label: "Projects", navHref: "#projects" },
  { key: "education", label: "Education", navHref: "#education" },
  { key: "certifications", label: "Certifications", navHref: "#certifications" },
  { key: "testimonials", label: "Testimonials", navHref: "#testimonials" },
  { key: "contact", label: "Contact", navHref: "#contact" },
] as const;

export type SectionKey = (typeof PORTFOLIO_SECTIONS)[number]["key"];

export type SectionVisibility = Record<SectionKey, boolean>;

export const DEFAULT_SECTION_VISIBILITY: SectionVisibility = {
  stats: true,
  skills: true,
  experience: true,
  projects: true,
  education: true,
  certifications: true,
  testimonials: true,
  contact: true,
};

export function normalizeSectionVisibility(
  value: unknown,
): SectionVisibility {
  const parsed =
    value && typeof value === "object"
      ? (value as Partial<SectionVisibility>)
      : {};

  return {
    stats: parsed.stats ?? DEFAULT_SECTION_VISIBILITY.stats,
    skills: parsed.skills ?? DEFAULT_SECTION_VISIBILITY.skills,
    experience: parsed.experience ?? DEFAULT_SECTION_VISIBILITY.experience,
    projects: parsed.projects ?? DEFAULT_SECTION_VISIBILITY.projects,
    education: parsed.education ?? DEFAULT_SECTION_VISIBILITY.education,
    certifications:
      parsed.certifications ?? DEFAULT_SECTION_VISIBILITY.certifications,
    testimonials:
      parsed.testimonials ?? DEFAULT_SECTION_VISIBILITY.testimonials,
    contact: parsed.contact ?? DEFAULT_SECTION_VISIBILITY.contact,
  };
}

export function isSectionVisible(
  visibility: SectionVisibility | null | undefined,
  key: SectionKey,
): boolean {
  if (!visibility) return DEFAULT_SECTION_VISIBILITY[key];
  return visibility[key] ?? DEFAULT_SECTION_VISIBILITY[key];
}
