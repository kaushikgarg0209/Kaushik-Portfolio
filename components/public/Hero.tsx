"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { ArrowDown, Download, MapPin } from "lucide-react";
import { useRef } from "react";

import { Scene3D } from "@/components/public/Scene3D";
import { getMotionProps, useReducedMotion } from "@/hooks/useReducedMotion";
import type { Profile } from "@/lib/db/schema";

interface HeroProps {
  profile: Profile;
  introReady: boolean;
  boostActive?: boolean;
}

const availabilityLabels = {
  open_to_work: { text: "Open to Work", color: "bg-green-500/20 text-green-400" },
  open_to_freelance: { text: "Open to Freelance", color: "bg-cyan-500/20 text-cyan-400" },
  not_looking: { text: "Not Looking", color: "bg-slate-500/20 text-slate-400" },
};

const SITE_EASE = [0.22, 1, 0.36, 1] as const;

const fadeUp = (delay: number, reducedMotion: boolean) => ({
  ...getMotionProps(reducedMotion),
  initial: reducedMotion ? false : { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: SITE_EASE },
});

export function Hero({ profile, introReady, boostActive = false }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  const roles = (profile.typedRoles as string[]) ?? [profile.title];
  const availability = availabilityLabels[profile.availabilityStatus];

  const typeSequence: (string | number)[] = [];
  roles.forEach((role, i) => {
    typeSequence.push(role);
    if (i < roles.length - 1) typeSequence.push(2000);
  });

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative flex min-h-screen items-center overflow-hidden bg-[#0a0a0f]"
    >
      <div className="absolute inset-0 z-0 grid-bg" />

      {introReady && (
        <>
          <div className="hero-mesh-gradient absolute inset-0 z-0 md:hidden" />

          <div className="pointer-events-none absolute inset-0 z-[1] hidden md:block">
            <Scene3D boostActive={boostActive} containerRef={sectionRef} />
          </div>

          <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center gap-12 px-6 pt-24 md:flex-row md:pt-0">
            <div className="flex-1 text-center md:text-left">
              <motion.p
                {...fadeUp(0.1, reducedMotion)}
                className="mb-2 font-mono text-sm text-cyan-400"
              >
                $ whoami
              </motion.p>
              <motion.h1
                {...fadeUp(0.25, reducedMotion)}
                className="mb-2 text-4xl font-bold text-white md:text-6xl"
              >
                Hi, I&apos;m{" "}
                <span className="text-gradient">
                  {profile.preferredName ?? profile.fullName}
                </span>
              </motion.h1>

              <motion.div
                {...fadeUp(0.4, reducedMotion)}
                className="mb-4 h-8 font-mono text-xl text-cyan-300 md:text-2xl"
              >
                <TypeAnimation
                  sequence={
                    typeSequence.length ? [...typeSequence, 2000] : [profile.title]
                  }
                  wrapper="span"
                  speed={50}
                  repeat={Infinity}
                />
              </motion.div>

              <motion.p {...fadeUp(0.55, reducedMotion)} className="mb-4 text-lg text-slate-400">
                {profile.tagline}
              </motion.p>

              <motion.div
                {...fadeUp(0.65, reducedMotion)}
                className="mb-6 flex flex-wrap items-center justify-center gap-3 md:justify-start"
              >
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${availability.color}`}
                >
                  {availability.text}
                </span>
                <span className="flex items-center gap-1 text-sm text-slate-400">
                  <MapPin className="h-4 w-4" />
                  {profile.location}
                </span>
              </motion.div>

              <motion.p {...fadeUp(0.75, reducedMotion)} className="mb-8 max-w-xl text-slate-400">
                {profile.bioShort}
              </motion.p>

              <motion.div
                {...fadeUp(0.85, reducedMotion)}
                className="flex flex-wrap justify-center gap-4 md:justify-start"
              >
                <a
                  href="#projects"
                  className="rounded-lg bg-cyan-500 px-6 py-3 text-sm font-medium text-slate-950 transition-colors hover:bg-cyan-400"
                >
                  View Projects
                </a>
                <a
                  href="#contact"
                  className="rounded-lg border border-white/10 px-6 py-3 text-sm font-medium text-white transition-colors hover:border-cyan-500/40 hover:text-cyan-400"
                >
                  Contact Me
                </a>
                {profile.resumeUrl && (
                  <Link
                    href={profile.resumeUrl}
                    target="_blank"
                    className="flex items-center gap-2 rounded-lg border border-white/10 px-6 py-3 text-sm font-medium text-white transition-colors hover:border-cyan-500/40"
                  >
                    <Download className="h-4 w-4" />
                    Resume
                  </Link>
                )}
              </motion.div>
            </div>

            <div className="relative">
              <motion.div {...fadeUp(0.5, reducedMotion)} className="relative">
                <div className="relative h-72 w-72 md:h-96 md:w-96">
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-x-6 bottom-14 top-6 rounded-full bg-cyan-500/5 blur-2xl"
                  />
                  {profile.profileImageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={profile.profileImageUrl}
                      alt={profile.fullName}
                      className="relative h-full w-full object-contain object-bottom drop-shadow-[0_12px_40px_rgba(0,212,255,0.18)]"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 font-mono text-6xl text-cyan-400">
                      {(profile.preferredName ?? profile.fullName).charAt(0)}
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-4 -right-4 rounded-lg border border-white/10 bg-[#12121a]/90 px-4 py-2 font-mono text-xs text-cyan-400 backdrop-blur-sm">
                  {profile.title}
                </div>
              </motion.div>
            </div>
          </div>

          <motion.a
            href="#stats"
            initial={reducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5, ease: SITE_EASE }}
            className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-slate-500 hover:text-cyan-400"
          >
            <ArrowDown className="h-6 w-6 animate-bounce" />
          </motion.a>
        </>
      )}
    </section>
  );
}
