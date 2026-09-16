"use client";

import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";

import { SectionHeader } from "@/components/public/SectionHeader";
import { SectionWrapper } from "@/components/public/SectionWrapper";
import { formatDate } from "@/lib/utils";
import type { Education } from "@/lib/db/schema";

export function EducationSection({ education }: { education: Education[] }) {
  return (
    <SectionWrapper id="education" className="bg-[#12121a]/50">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader
          command="$ cat education.json"
          title="Education"
          subtitle="Academic background"
        />

        <div className="grid gap-6 md:grid-cols-2">
          {education.map((edu, i) => (
            <motion.div
              key={edu.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-xl p-6"
            >
              <div className="mb-4 flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-500/10">
                  <GraduationCap className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{edu.degree}</h3>
                  <p className="text-cyan-400">{edu.institution}</p>
                  <p className="text-sm text-slate-500">{edu.field}</p>
                </div>
              </div>
              <p className="font-mono text-xs text-slate-500">
                {formatDate(edu.startDate)} — {formatDate(edu.endDate)}
              </p>
              {edu.grade && (
                <p className="mt-2 text-sm text-slate-400">Grade: {edu.grade}</p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
