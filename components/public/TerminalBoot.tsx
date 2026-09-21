"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";

interface TerminalBootProps {
  name: string;
  enabled: boolean;
  onComplete: () => void;
}

const LINE_DELAY_MS = 240;
const HOLD_BEFORE_EXIT_MS = 600;
const EXIT_DURATION_MS = 700;

const bootLines = (name: string) => [
  "> initializing portfolio...",
  "> loading: react · next · three.js",
  `> whoami: ${name}`,
  "> system ready — welcome.",
];

function wasBootSkipped() {
  return (
    typeof window !== "undefined" &&
    sessionStorage.getItem("boot-skipped") === "1"
  );
}

type BootPhase = "typing" | "hold" | "exit" | "hidden";

export function TerminalBoot({ name, enabled, onComplete }: TerminalBootProps) {
  const [visibleLines, setVisibleLines] = useState(0);
  const [phase, setPhase] = useState<BootPhase>(() =>
    wasBootSkipped() ? "hidden" : "typing",
  );
  const [hasNotifiedComplete, setHasNotifiedComplete] = useState(false);
  const lines = bootLines(name);
  const progress = Math.round((visibleLines / lines.length) * 100);

  const notifyComplete = useCallback(() => {
    if (hasNotifiedComplete) return;
    setHasNotifiedComplete(true);
    onComplete();
  }, [hasNotifiedComplete, onComplete]);

  const skipBoot = useCallback(() => {
    if (phase === "exit" || phase === "hidden") return;
    sessionStorage.setItem("boot-skipped", "1");
    setPhase("exit");
  }, [phase]);

  const finishBoot = useCallback(() => {
    if (phase === "exit" || phase === "hidden") return;
    setPhase("exit");
  }, [phase]);

  useEffect(() => {
    if (!enabled || phase === "hidden") {
      notifyComplete();
      return;
    }

    if (phase === "exit") {
      notifyComplete();
      return;
    }

    if (phase === "typing" && visibleLines < lines.length) {
      const timer = setTimeout(
        () => setVisibleLines((v) => v + 1),
        LINE_DELAY_MS,
      );
      return () => clearTimeout(timer);
    }

    if (phase === "typing" && visibleLines >= lines.length) {
      setPhase("hold");
      return;
    }

    if (phase === "hold") {
      const timer = setTimeout(() => finishBoot(), HOLD_BEFORE_EXIT_MS);
      return () => clearTimeout(timer);
    }
  }, [
    enabled,
    phase,
    visibleLines,
    lines.length,
    notifyComplete,
    finishBoot,
  ]);

  useEffect(() => {
    if (!enabled || phase === "hidden" || phase === "exit") return;

    function handleKeyDown() {
      skipBoot();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enabled, phase, skipBoot]);

  if (!enabled || phase === "hidden") return null;

  const isExiting = phase === "exit";
  const filledBars = Math.round((progress / 100) * 10);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: isExiting ? 0 : 1 }}
      transition={{ duration: EXIT_DURATION_MS / 1000, ease: [0.22, 1, 0.36, 1] }}
      onAnimationComplete={() => {
        if (isExiting) setPhase("hidden");
      }}
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#0a0a0f]"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{
          opacity: isExiting ? 0 : 1,
          scale: isExiting ? 1.08 : 1,
          y: isExiting ? -120 : 0,
        }}
        transition={{ duration: isExiting ? 0.65 : 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-lg origin-center rounded-xl border border-cyan-500/20 bg-black/80 p-6 font-mono text-sm shadow-2xl glow-cyan"
      >
        <div className="mb-4 flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-red-500/80" />
          <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
          <div className="h-3 w-3 rounded-full bg-green-500/80" />
          <span className="ml-2 text-slate-500">terminal — boot</span>
        </div>

        <div className="mb-4 font-mono text-xs text-slate-500">
          [{ "=".repeat(filledBars)}
          {filledBars < 10 ? ">" : ""}
          {" ".repeat(Math.max(0, 10 - filledBars - (filledBars < 10 ? 1 : 0)))}] loading modules...
        </div>

        {lines.slice(0, visibleLines).map((line, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="text-cyan-300/90"
          >
            {line}
          </motion.p>
        ))}
        {phase === "typing" && visibleLines < lines.length && (
          <span className="terminal-cursor text-cyan-400" />
        )}
        <button
          type="button"
          onClick={skipBoot}
          className="mt-4 text-xs text-slate-500 transition-colors hover:text-cyan-400"
        >
          [skip · won&apos;t show again this session]
        </button>
      </motion.div>
    </motion.div>
  );
}
