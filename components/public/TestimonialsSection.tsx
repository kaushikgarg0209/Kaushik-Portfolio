"use client";

import { Quote } from "lucide-react";
import Image from "next/image";

import { SectionHeader } from "@/components/public/SectionHeader";
import { SectionWrapper } from "@/components/public/SectionWrapper";
import type { Testimonial } from "@/lib/db/schema";

export function TestimonialsSection({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  if (!testimonials.length) return null;

  return (
    <SectionWrapper id="testimonials" variant="testimonials">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader
          kicker="Testimonials"
          title="What People Say"
          subtitle="Recommendations from colleagues and clients"
        />

        <div className="grid gap-6 md:grid-cols-2">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="glass relative rounded-xl p-6 transition-shadow hover:-translate-y-1 hover:shadow-[0_0_24px_rgba(0,212,255,0.08)]"
            >
              <Quote className="absolute right-4 top-4 h-8 w-8 text-cyan-500/10" />
              <p className="mb-6 text-slate-300">&ldquo;{t.content}&rdquo;</p>
              <div className="flex items-center gap-3">
                {t.avatarUrl ? (
                  <div className="relative h-10 w-10 overflow-hidden rounded-full">
                    <Image src={t.avatarUrl} alt={t.name} fill className="object-cover" />
                  </div>
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500/10 text-sm font-medium text-cyan-400">
                    {t.name.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="font-medium text-white">{t.name}</p>
                  <p className="text-sm text-slate-400">
                    {t.role} at {t.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
