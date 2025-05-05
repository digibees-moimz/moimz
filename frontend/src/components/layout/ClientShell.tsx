// src/components/layout/ClientShell.tsx
"use client";

import AppLayout from "./AppLayout";
import { usePathname } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function ClientShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isFullscreenPage = pathname.startsWith("/my/face-register");

  const [queryClient] = useState(() => new QueryClient());
  const content = isFullscreenPage ? (
    children
  ) : (
    <AppLayout>{children}</AppLayout>
  );

  return (
    <QueryClientProvider client={queryClient}>{content}</QueryClientProvider>
  );
}
