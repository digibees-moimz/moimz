// src/components/layout/TabNav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Flex } from "@/components/ui-components/layout/Flex";
import { IoSettingsOutline } from "react-icons/io5";

export default function TabNav() {
  const pathname = usePathname();

  const tabs = [
    { label: "커뮤니티", href: "/groups/1/community" },
    { label: "앨범", href: "/groups/1/album" },
    { label: "캘린더", href: "/groups/1/calendar" },
  ];

  return (
    <Flex.RowBetweenCenter className="sticky top-12 z-40 px-6 py-2 border-b border-gray-300 bg-white/80">
      <Flex.RowStartCenter className="gap-4">
        {tabs.map((tab) => (
          <Link key={tab.href} href={tab.href}>
            <span
              className={`text-sm ${
                pathname.includes(tab.href)
                  ? "font-bold text-green-700 underline underline-offset-13"
                  : ""
              }`}
              style={{ textDecorationThickness: "4px" }}
            >
              {tab.label}
            </span>
          </Link>
        ))}
      </Flex.RowStartCenter>

      {/* 세팅 버튼 */}
      <button>
        <IoSettingsOutline size={18} color="gray" />
      </button>
    </Flex.RowBetweenCenter>
  );
}
