"use client";

import { motion } from "framer-motion";
import { Briefcase } from "lucide-react";

import { SectionHeader } from "@/components/public/SectionHeader";
import { SectionWrapper } from "@/components/public/SectionWrapper";
import { formatDate } from "@/lib/utils";
import type { Experience } from "@/lib/db/schema";

export function ExperienceTimeline({ experience }: { experience: Experience[] }) {
  return (
    <SectionWrapper id="experience" className="bg-[#12121a]/50">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader
          command="$ cat experience.log"
          title="Work Experience"
          subtitle="My professional journey"
        />

        <div className="relative space-y-8 before:absolute before:left-4 before:top-2 before:h-[calc(100%-2rem)] before:w-px before:bg-gradient-to-b before:from-cyan-500/50 before:to-purple-500/20 md:before:left-8">
          {experience.map((exp, i) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative pl-12 md:pl-20"
            >
              <div className="absolute left-2 top-2 flex h-5 w-5 items-center justify-center rounded-full border border-cyan-500/50 bg-[#0a0a0f] md:left-6">
                <Briefcase className="h-3 w-3 text-cyan-400" />
              </div>

              <div className="glass rounded-xl p-6">
                <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{exp.role}</h3>
                    <p className="text-cyan-400">{exp.company}</p>
                  </div>
                  <span className="font-mono text-xs text-slate-500">
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
                        className="rounded-full bg-white/5 px-2 py-0.5 font-mono text-xs text-slate-400"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
