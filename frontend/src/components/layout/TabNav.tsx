// src/components/layout/TabNav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Flex } from "@/components/ui-components/layout/Flex";

export default function TabNav() {
  const pathname = usePathname();

  const tabs = [
    { label: "커뮤니티", href: "/groups/1/community" },
    { label: "앨범", href: "/groups/1/album" },
    { label: "캘린더", href: "/groups/1/calendar" },
  ];

  return (
    <Flex.RowBetweenCenter className="px-4 py-2 border-b">
      <Flex.RowStartCenter className="gap-4">
        {tabs.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className={`text-sm ${
              pathname.includes(tab.href) ? "font-bold underline" : ""
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </Flex.RowStartCenter>
      <button>⚙️</button>
    </Flex.RowBetweenCenter>
  );
}
