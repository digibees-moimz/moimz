// src/components/layout/TabNav.tsx
"use client";

import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { Flex } from "@/components/ui-components/layout/Flex";
import { IoSettingsOutline } from "react-icons/io5";

export default function TabNav() {
  const pathname = usePathname();
  const { groupId } = useParams();

  const base = `/groups/${groupId}`;
  const tabs = [
    { label: "모임", href: `${base}` },
    { label: "출석체크", href: `${base}/attendance` },
    { label: "캘린더", href: `${base}/calendar` },
    { label: "앨범", href: `${base}/album` },
    { label: "다이어리", href: `${base}/diary` },
  ];

  const activeTabHref = tabs
    .map((tab) => tab.href)
    .sort((a, b) => b.length - a.length) // 긴 게 먼저 오도록 정렬
    .find((href) => pathname.startsWith(href));

  return (
    <Flex.RowBetweenCenter className="sticky top-12 z-40 px-6 py-2 border-b border-gray-300 bg-white/80">
      <Flex.RowStartCenter className="gap-4">
        {tabs.map((tab) => (
          <Link key={tab.href} href={tab.href}>
            <span
              className={`text-sm ${
                activeTabHref === tab.href
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
