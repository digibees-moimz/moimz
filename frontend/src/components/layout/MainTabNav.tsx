"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Flex } from "@/components/ui-components/layout/Flex";

export default function GlobalHeader() {
  const pathname = usePathname();

  const tabs = [
    { label: "모임통장", href: "/" },
    { label: "내 모임비", href: "/my" },
    { label: "결제", href: "/payment" },
    { label: "일정", href: "/calendar" },
    { label: "마이", href: "/profile" },
  ];

  return (
    <Flex.RowStartCenter className="gap-4 sticky top-12 z-40 px-6 py-2 border-b border-gray-300 bg-white/80">
      {tabs.map((tab) => (
        <Link key={tab.href} href={tab.href}>
          <span
            className={`text-sm ${
              pathname === tab.href
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
  );
}
