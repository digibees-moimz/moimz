// src/app/groups/[groupId]/page.tsx

"use client";

import { useParams } from "next/navigation";
import GroupDetailSection from "@/components/group/GroupDetailSection";
import { useUserStore } from "@/stores/userStore";
import NextScheduleCard from "@/components/scheduleDetail/NextScheduleCard";
import { ScheduleCard } from "@/components/schedule/ScheduleCard";
import { useGroupUpcomingSchedule } from "@/hooks/schedule/useUpcomingSchedule";
import { formatTimeOnly, getDdayLabel } from "@/utils/formatDate";

export default function GroupDetailPage() {
  const { groupId } = useParams<{ groupId: string }>();
  const groupIdNum = Number(groupId);

  if (isNaN(groupIdNum)) return <div>잘못된 그룹입니다.</div>;

  const { data: next } = useGroupUpcomingSchedule(groupIdNum);

  return (
    <>
    {/* 모임통장 상세 */}
      <GroupDetailSection groupId={groupIdNum} />

      {/* 다음 일정 */}
      {next && (
        <ScheduleCard
          type="next"
          scheduleTitle={next.title}
          time={formatTimeOnly(next.date)}
          dday={getDdayLabel(next.date)}
        />
      )}
    </>
  );
}
