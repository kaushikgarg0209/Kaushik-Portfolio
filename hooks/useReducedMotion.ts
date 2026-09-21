"use client";

import { useEffect, useState } from "react";

export function useReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);

    function onChange(e: MediaQueryListEvent) {
      setReducedMotion(e.matches);
    }

    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reducedMotion;
}

/** Returns `{ initial: false }` when reduced motion is preferred — pass to motion components. */
export function getMotionProps(reducedMotion: boolean) {
  return reducedMotion ? ({ initial: false } as const) : {};
}
