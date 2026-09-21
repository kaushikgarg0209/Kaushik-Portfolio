"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
}

export function TiltCard({ children, className }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("");
  const [glow, setGlow] = useState({ x: 50, y: 50 });
  const reducedMotion = useReducedMotion();
  const [coarsePointer, setCoarsePointer] = useState(false);

  useEffect(() => {
    setCoarsePointer(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  const disabled = reducedMotion || coarsePointer;

  const handleMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (disabled || !ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const rotX = (y - 0.5) * -16;
      const rotY = (x - 0.5) * 16;

      setTransform(
        `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.02, 1.02, 1.02)`,
      );
      setGlow({ x: x * 100, y: y * 100 });
    },
    [disabled],
  );

  function handleLeave() {
    setTransform("");
    setGlow({ x: 50, y: 50 });
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={cn("relative transition-transform duration-200 ease-out", className)}
      style={{
        transform: disabled ? undefined : transform || undefined,
        transformStyle: "preserve-3d",
      }}
    >
      {!disabled && transform && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-xl"
          style={{
            background: `radial-gradient(circle at ${glow.x}% ${glow.y}%, rgba(0,212,255,0.14), transparent 55%)`,
          }}
        />
      )}
      {children}
    </div>
  );
}
