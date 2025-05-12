// src/app/groups/[groupId]/calendar/page.tsx
"use client";

import { useParams } from "next/navigation";
import CalendarView from "@/components/calendar/CalendarView";

export default function CalendarPage() {
  const { groupId } = useParams();
  const gid = Number(groupId);

  return <CalendarView groupId={gid} />;
}
