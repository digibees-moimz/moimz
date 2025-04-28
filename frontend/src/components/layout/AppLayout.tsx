// src/components/layout/AppLayout.tsx
import { Flex } from "../ui-components/layout/Flex";
import Header from "./Header";
import TabNav from "./TabNav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-screen min-h-screen flex flex-col">
      <Header />
      <TabNav />
      <Flex.ColCenter as="main" className="p-4 bg-green-50">
        {children}
      </Flex.ColCenter>
    </div>
  );
}
