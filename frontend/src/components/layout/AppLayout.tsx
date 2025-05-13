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

  const isGroupPageWithoutPadding = [
    /^\/groups\/[^/]+\/?$/, // 모임 상세 페이지
    /^\/groups\/[^/]+\/calendar\/create$/, // 일정 등록 페이지
    /^\/groups\/[^/]+\/album\/photo\/[^/]+$/, // 사진 상세 페이지
  ].some((regex) => regex.test(pathname));

  return (
    <div className="flex flex-col w-screen min-h-screen">
      <Header />
      {isMoimMain ? <MainTab /> : <TabNav />}
      <main className="h-[calc(100vh-96px)]">
        <Container
          as="section"
          className={isGroupPageWithoutPadding ? "p-0" : "py-6 space-y-6"}
        >
          {children}
        </Container>
      </main>
    </div>
  );
}
