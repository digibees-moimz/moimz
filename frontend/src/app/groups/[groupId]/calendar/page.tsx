// src/app/groups/[groupId]/calendar/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import CalendarView from "@/components/calendar/CalendarView";

export default function CalendarPage() {
  const { groupId } = useParams();
  const gid = Number(groupId);
  const router = useRouter();

  return (
    <div className="relative max-w-md mx-auto pt-4">
      <CalendarView groupId={gid} />
    </div>
  );
}
