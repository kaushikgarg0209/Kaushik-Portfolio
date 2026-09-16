"use client";

import { motion } from "framer-motion";

import { SectionHeader } from "@/components/public/SectionHeader";
import { SectionWrapper } from "@/components/public/SectionWrapper";
import type { Skill } from "@/lib/db/schema";

export function SkillsSection({ skills }: { skills: Skill[] }) {
  const categories = [...new Set(skills.map((s) => s.category))];

  return (
    <SectionWrapper id="skills">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader
          command="$ ls skills/"
          title="Skills & Technologies"
          subtitle="Tools and technologies I work with"
        />

        <div className="space-y-8">
          {categories.map((category) => (
            <div key={category}>
              <h3 className="mb-4 font-mono text-sm text-purple-400">
                ./skills/{category.toLowerCase().replace(/\s+/g, "-")}
              </h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {skills
                  .filter((s) => s.category === category)
                  .map((skill, i) => (
                    <motion.div
                      key={skill.id}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                      className="glass rounded-lg p-4"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <span className="font-medium text-white">{skill.name}</span>
                        <span className="font-mono text-xs text-cyan-400">
                          {skill.proficiency}/5
                        </span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${(skill.proficiency / 5) * 100}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: i * 0.05 }}
                          className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-purple-500"
                        />
                      </div>
                    </motion.div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
