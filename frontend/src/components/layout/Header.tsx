// src/components/layout/Header.tsx
"use client";

import { useRouter } from "next/navigation";
import { Flex } from "@/components/ui-components/layout/Flex";

export default function Header() {
  const router = useRouter();

  return (
    <Flex.RowStartCenter className="h-12 px-6">
      <button onClick={() => router.back()}>←</button>
    </Flex.RowStartCenter>
  );
}
