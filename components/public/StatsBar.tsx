"use client";

import { SectionHeader } from "@/components/public/SectionHeader";
import { SectionWrapper } from "@/components/public/SectionWrapper";
import { StaggerContainer, StaggerItem } from "@/components/public/StaggerChildren";
import type { Stat } from "@/lib/db/schema";

export function StatsBar({ stats }: { stats: Stat[] }) {
  if (!stats.length) return null;

  const maxValue = Math.max(...stats.map((s) => s.value), 1);

  return (
    <SectionWrapper id="stats" variant="stats" className="py-16">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader
          kicker="Highlights"
          title="By the Numbers"
          subtitle="Key milestones at a glance"
        />

        <StaggerContainer className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {stats.map((stat) => (
            <StaggerItem key={stat.id}>
              <div className="glass rounded-xl p-6 text-center transition-shadow hover:-translate-y-1 hover:shadow-[0_0_24px_rgba(0,212,255,0.08)]">
                <p className="text-3xl font-bold text-cyan-400 md:text-4xl">
                  {stat.value}
                  {stat.suffix}
                </p>
                <p className="mt-2 text-sm text-slate-400">{stat.label}</p>
                <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-purple-500"
                    style={{ width: `${(stat.value / maxValue) * 100}%` }}
                  />
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </SectionWrapper>
  );
}
