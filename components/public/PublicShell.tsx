"use client";

import { CustomCursor } from "@/components/public/CustomCursor";

export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CustomCursor />
      {children}
    </>
  );
}
