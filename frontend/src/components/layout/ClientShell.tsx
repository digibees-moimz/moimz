// src/components/layout/ClientShell.tsx
"use client";

import AppLayout from "./AppLayout";
import { usePathname } from "next/navigation";

export default function ClientShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isFullscreenPage = pathname.startsWith("/my/face-register");

  return isFullscreenPage ? <>{children}</> : <AppLayout>{children}</AppLayout>;
}
