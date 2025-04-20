// src/components/layout/Header.tsx
"use client";

import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();

  return (
    <div className="h-12 flex items-center px-4">
      <button onClick={() => router.back()}>←</button>
    </div>
  );
}
