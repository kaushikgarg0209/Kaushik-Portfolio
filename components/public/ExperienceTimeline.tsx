"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Briefcase } from "lucide-react";

import { SectionHeader } from "@/components/public/SectionHeader";
import { SectionWrapper } from "@/components/public/SectionWrapper";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { formatDate } from "@/lib/utils";
import type { Experience } from "@/lib/db/schema";

const TIMELINE_LEFT = "left-4 md:left-8";

export function ExperienceTimeline({ experience }: { experience: Experience[] }) {
  const reducedMotion = useReducedMotion();
  const timelineRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 85%", "end 35%"],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <SectionWrapper id="experience" variant="experience">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader
          kicker="Experience"
          title="Work Experience"
          subtitle="My professional journey"
        />

        <div ref={timelineRef} className="relative space-y-8">
          <div
            className={`pointer-events-none absolute ${TIMELINE_LEFT} top-0 bottom-0 w-px bg-white/10`}
            aria-hidden
          />

          {reducedMotion ? (
            <div
              className={`pointer-events-none absolute ${TIMELINE_LEFT} top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500/70 to-purple-500/30`}
              aria-hidden
            />
          ) : (
            <motion.div
              className={`pointer-events-none absolute ${TIMELINE_LEFT} top-0 w-px origin-top bg-gradient-to-b from-cyan-500 to-purple-500/60`}
              style={{ height: lineHeight }}
              aria-hidden
            />
          )}

          {experience.map((exp) => (
            <div key={exp.id} className="relative pl-12 md:pl-20">
              <div className="absolute left-2 top-2 z-10 flex h-5 w-5 items-center justify-center rounded-full border border-cyan-500/50 bg-[#0a0a0f] md:left-6">
                <Briefcase className="h-3 w-3 text-cyan-400" />
              </div>

              <div className="glass rounded-xl p-6 transition-shadow hover:-translate-y-0.5 hover:shadow-[0_0_24px_rgba(0,212,255,0.08)]">
                <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{exp.role}</h3>
                    <p className="text-cyan-400">{exp.company}</p>
                  </div>
                  <span className="text-xs text-slate-500">
                    {formatDate(exp.startDate)} — {formatDate(exp.endDate)}
                  </span>
                </div>
                <p className="mb-1 text-sm text-slate-500">
                  {exp.location} · {exp.employmentType.replace("_", " ")}
                </p>
                {exp.description && (
                  <p className="mb-4 text-sm text-slate-400">{exp.description}</p>
                )}
                {(exp.achievements as string[])?.length > 0 && (
                  <ul className="mb-4 space-y-1">
                    {(exp.achievements as string[]).map((a, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-slate-300">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-cyan-400" />
                        {a}
                      </li>
                    ))}
                  </ul>
                )}
                {(exp.techUsed as string[])?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {(exp.techUsed as string[]).map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-slate-400"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
