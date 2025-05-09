// src/components/layout/AppLayout.tsx
"use client";

import Header from "./Header";
import { Container } from "@/components/ui-components/layout/Container";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col w-screen min-h-screen">
      <Header />
      <main className="h-[calc(100vh-96px)]">
        <Container as="section" className="py-6 space-y-6">
          {children}
        </Container>
      </main>
    </div>
  );
}
