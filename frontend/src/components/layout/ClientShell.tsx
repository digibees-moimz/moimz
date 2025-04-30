// src/components/layout/ClientShell.tsx
"use client";

import AppLayout from "./AppLayout";

export default function ClientShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
}
