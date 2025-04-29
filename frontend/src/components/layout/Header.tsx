// src/components/layout/Header.tsx
"use client";

import { useRouter } from "next/navigation";
import { Flex } from "@/components/ui-components/layout/Flex";
import { IoArrowBack } from "react-icons/io5";

export default function Header() {
  const router = useRouter();

  return (
    <Flex.RowStartCenter className="sticky top-0 z-50 h-12 px-6 pt-2 bg-white">
      <button onClick={() => router.back()}>
        <IoArrowBack size={18} color="#d1d1d1" />
      </button>
    </Flex.RowStartCenter>
  );
}
