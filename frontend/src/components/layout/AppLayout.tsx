// src/components/layout/AppLayout.tsx
import Header from "./Header";
import TabNav from "./TabNav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full max-w-md mx-auto">
      <Header />
      <TabNav />
      <main className="p-4">{children}</main>
    </div>
  );
}
