"use client";

import { useEffect, useRef } from "react";

const KONAMI_SEQUENCE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "KeyB",
  "KeyA",
] as const;

const STORAGE_KEY = "konami-triggered";

export function useKonamiCode(onTrigger: () => void, enabled = true) {
  const indexRef = useRef(0);
  const onTriggerRef = useRef(onTrigger);

  useEffect(() => {
    onTriggerRef.current = onTrigger;
  }, [onTrigger]);

  useEffect(() => {
    if (!enabled) return;
    if (sessionStorage.getItem(STORAGE_KEY) === "1") return;

    function onKeyDown(e: KeyboardEvent) {
      const expected = KONAMI_SEQUENCE[indexRef.current];

      if (e.code === expected) {
        indexRef.current += 1;
        if (indexRef.current === KONAMI_SEQUENCE.length) {
          sessionStorage.setItem(STORAGE_KEY, "1");
          indexRef.current = 0;
          onTriggerRef.current();
        }
        return;
      }

      indexRef.current = e.code === KONAMI_SEQUENCE[0] ? 1 : 0;
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [enabled]);
}
