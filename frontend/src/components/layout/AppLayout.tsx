// src/components/layout/AppLayout.tsx
"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import TabNav from "./TabNav";
import MainTab from "./MainTabNav";
import { Container } from "@/components/ui-components/layout/Container";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMoimMain = !pathname.startsWith("/groups/");

  return (
    <div className="flex flex-col w-screen min-h-screen">
      <Header />
      {isMoimMain ? <MainTab /> : <TabNav />}
      <main className="flex-1">
        <Container as="section" className="py-6 space-y-6">
          {children}
        </Container>
      </main>
    </div>
  );
}
