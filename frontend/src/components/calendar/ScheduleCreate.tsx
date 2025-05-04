// src/componets/calendar/ScheduleCreate.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import ScheduleForm from "./ScheduleForm";
import { ScheduleItem } from "@/types/schedule";

/**
 * 일정 작성 페이지 또는 모달에 들어가는 ScheduleCreate 컴포넌트
 */
export default function ScheduleCreate() {
  const { groupId } = useParams();
  const router = useRouter();

  const handleCreated = (item: ScheduleItem) => {
    router.push(`/groups/${groupId}/calendar`);
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <ScheduleForm onCreated={handleCreated} />
    </div>
  );
}
