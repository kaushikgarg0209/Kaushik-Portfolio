import { cn } from "@/lib/utils";

export type SectionVariant =
  | "default"
  | "stats"
  | "skills"
  | "experience"
  | "projects"
  | "education"
  | "certifications"
  | "testimonials"
  | "contact";

const variantClasses: Record<SectionVariant, string> = {
  default: "section-atmosphere",
  stats: "section-atmosphere section-stats",
  skills: "section-atmosphere section-skills",
  experience: "section-atmosphere section-experience bg-[#12121a]/40",
  projects: "section-atmosphere section-projects",
  education: "section-atmosphere section-education bg-[#12121a]/40",
  certifications: "section-atmosphere section-certifications bg-[#12121a]/40",
  testimonials: "section-atmosphere section-testimonials bg-[#12121a]/40",
  contact: "section-atmosphere section-contact",
};

interface SectionWrapperProps {
  id: string;
  children: React.ReactNode;
  className?: string;
  variant?: SectionVariant;
}

export function SectionWrapper({
  id,
  children,
  className = "",
  variant = "default",
}: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={cn("relative py-24", variantClasses[variant], className)}
    >
      {children}
    </section>
  );
}
