// src/components/layout/AppLayout.tsx
import Header from "./Header";
import TabNav from "./TabNav";
import { Container } from "@/components/ui-components/layout/Container";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col w-screen min-h-screen">
      <Header />
      <TabNav />
      <main className="flex-1">
        <Container as="section" className="py-6 space-y-6">
          {children}
        </Container>
      </main>
    </div>
  );
}
