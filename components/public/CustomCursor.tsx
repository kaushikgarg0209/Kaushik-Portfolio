"use client";

import { useEffect, useRef } from "react";

const DOT_DEFAULT =
  "rounded-full border border-cyan-400/60 bg-cyan-400/10 transition-all duration-150 h-2 w-2 opacity-70";
const DOT_HOVER =
  "rounded-full border border-cyan-400/60 bg-cyan-400/10 transition-all duration-150 h-5 w-5 opacity-80";

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    if (reducedMotion || coarsePointer) return;

    function onMove(e: MouseEvent) {
      const cursor = cursorRef.current;
      if (!cursor) return;
      cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      cursor.style.opacity = "1";
    }

    function onLeave() {
      if (cursorRef.current) cursorRef.current.style.opacity = "0";
    }

    function onOver(e: MouseEvent) {
      const dot = dotRef.current;
      if (!dot) return;
      const target = e.target as HTMLElement;
      const hovering = Boolean(
        target.closest("a, button, input, textarea, select, [role='button']"),
      );
      dot.className = hovering ? DOT_HOVER : DOT_DEFAULT;
    }

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[200] opacity-0"
      style={{ willChange: "transform" }}
    >
      <div ref={dotRef} className={DOT_DEFAULT} />
    </div>
  );
}
