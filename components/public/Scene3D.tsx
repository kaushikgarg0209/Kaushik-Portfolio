"use client";

import { Sparkles } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Suspense,
  useRef,
  useMemo,
  useState,
  useEffect,
  type MutableRefObject,
  type RefObject,
} from "react";
import type { Points } from "three";

const PARTICLE_COUNT = 180;
const REPEL_RADIUS = 2.2;
const REPEL_STRENGTH = 0.018;
const DRIFT_SPEED = 0.0012;
const RIPPLE_DURATION_MS = 1000;

interface Ripple {
  x: number;
  y: number;
  z: number;
  strength: number;
  startedAt: number;
}

interface Scene3DProps {
  boostActive?: boolean;
  containerRef?: RefObject<HTMLElement | null>;
}

function ParticleField({
  mouse,
  ripplesRef,
  boostMultiplier,
}: {
  mouse: MutableRefObject<{ x: number; y: number; active: boolean }>;
  ripplesRef: MutableRefObject<Ripple[]>;
  boostMultiplier: number;
}) {
  const ref = useRef<Points>(null);

  const { basePositions, velocities } = useMemo(() => {
    const basePositions = new Float32Array(PARTICLE_COUNT * 3);
    const velocities = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      basePositions[i * 3] = (Math.random() - 0.5) * 16;
      basePositions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      basePositions[i * 3 + 2] = (Math.random() - 0.5) * 6;
      velocities[i * 3] = (Math.random() - 0.5) * DRIFT_SPEED;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * DRIFT_SPEED;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * DRIFT_SPEED * 0.5;
    }
    return { basePositions, velocities };
  }, []);

  const positions = useMemo(
    () => new Float32Array(basePositions),
    [basePositions],
  );

  useFrame(() => {
    if (!ref.current) return;
    const pos = ref.current.geometry.attributes.position.array as Float32Array;
    const now = performance.now();
    const speedScale = boostMultiplier;

    ripplesRef.current = ripplesRef.current.filter(
      (r) => now - r.startedAt < RIPPLE_DURATION_MS,
    );

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      let px = pos[i3];
      let py = pos[i3 + 1];
      let pz = pos[i3 + 2];

      px += velocities[i3] * speedScale;
      py += velocities[i3 + 1] * speedScale;
      pz += velocities[i3 + 2] * speedScale;

      if (mouse.current.active) {
        const dx = px - mouse.current.x * 8;
        const dy = py - mouse.current.y * 5;
        const dz = pz;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) || 0.001;

        if (dist < REPEL_RADIUS) {
          const force =
            (1 - dist / REPEL_RADIUS) * REPEL_STRENGTH * speedScale;
          px += (dx / dist) * force;
          py += (dy / dist) * force;
          pz += (dz / dist) * force * 0.5;
        }
      }

      for (const ripple of ripplesRef.current) {
        const age = (now - ripple.startedAt) / RIPPLE_DURATION_MS;
        const dx = px - ripple.x;
        const dy = py - ripple.y;
        const dz = pz - ripple.z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) || 0.001;
        const waveRadius = age * 8;
        const band = Math.abs(dist - waveRadius);

        if (band < 1.5) {
          const force =
            (1 - band / 1.5) * ripple.strength * (1 - age) * speedScale;
          px += (dx / dist) * force;
          py += (dy / dist) * force;
          pz += (dz / dist) * force * 0.4;
        }
      }

      const bx = basePositions[i3];
      const by = basePositions[i3 + 1];
      const bz = basePositions[i3 + 2];
      px += (bx - px) * 0.002;
      py += (by - py) * 0.002;
      pz += (bz - pz) * 0.002;

      pos[i3] = px;
      pos[i3 + 1] = py;
      pos[i3 + 2] = pz;
    }

    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={PARTICLE_COUNT}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.055 * Math.min(boostMultiplier, 1.4)}
        color="#00d4ff"
        transparent
        opacity={0.35 + boostMultiplier * 0.12}
        sizeAttenuation
      />
    </points>
  );
}

function SceneContent({
  mouse,
  ripplesRef,
  boostMultiplier,
}: {
  mouse: MutableRefObject<{ x: number; y: number; active: boolean }>;
  ripplesRef: MutableRefObject<Ripple[]>;
  boostMultiplier: number;
}) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <Sparkles
        count={boostMultiplier > 1 ? 22 : 15}
        scale={14}
        size={1.5}
        speed={0.2 * boostMultiplier}
        opacity={0.25}
        color="#8b5cf6"
      />
      <ParticleField
        mouse={mouse}
        ripplesRef={ripplesRef}
        boostMultiplier={boostMultiplier}
      />
    </>
  );
}

function SceneFallback() {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5" />
  );
}

function screenToWorld(
  clientX: number,
  clientY: number,
  rect: DOMRect,
): { x: number; y: number; z: number } {
  const nx = ((clientX - rect.left) / rect.width - 0.5) * 2;
  const ny = -((clientY - rect.top) / rect.height - 0.5) * 2;
  return { x: nx * 8, y: ny * 5, z: 0 };
}

export function Scene3D({ boostActive = false, containerRef }: Scene3DProps) {
  const mouse = useRef({ x: 0, y: 0, active: false });
  const ripplesRef = useRef<Ripple[]>([]);
  const [reducedMotion, setReducedMotion] = useState(false);

  const boostMultiplier = boostActive ? 2 : 1;

  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    const container = containerRef?.current;
    if (!container || reducedMotion) return;

    function onMove(e: MouseEvent) {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const inBounds =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      if (!inBounds) {
        mouse.current.active = false;
        return;
      }

      const world = screenToWorld(e.clientX, e.clientY, rect);
      mouse.current = { x: world.x / 8, y: world.y / 5, active: true };
    }

    function onLeave() {
      mouse.current.active = false;
    }

    function onClick(e: MouseEvent) {
      if (!container) return;
      const target = e.target as HTMLElement;
      if (target.closest("a, button, input, textarea, select, [role='button']")) {
        return;
      }

      const rect = container.getBoundingClientRect();
      if (
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom
      ) {
        return;
      }

      const world = screenToWorld(e.clientX, e.clientY, rect);
      ripplesRef.current.push({
        x: world.x,
        y: world.y,
        z: world.z,
        strength: boostActive ? 0.35 : 0.22,
        startedAt: performance.now(),
      });
    }

    window.addEventListener("mousemove", onMove, { passive: true });
    container.addEventListener("mouseleave", onLeave);
    container.addEventListener("click", onClick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      container.removeEventListener("mouseleave", onLeave);
      container.removeEventListener("click", onClick);
    };
  }, [containerRef, reducedMotion, boostActive]);

  if (reducedMotion) return <SceneFallback />;

  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }} dpr={[1, 1.5]}>
        <Suspense fallback={null}>
          <SceneContent
            mouse={mouse}
            ripplesRef={ripplesRef}
            boostMultiplier={boostMultiplier}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
