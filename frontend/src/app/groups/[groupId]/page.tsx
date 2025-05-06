// src/app/groups/[groupId]/page.tsx

"use client";

import { useParams } from "next/navigation";
import GroupDetailSection from "@/components/group/GroupDetailSection";
import { useUserStore } from "@/stores/userStore";
import NextScheduleCard from "@/components/scheduleDetail/NextScheduleCard";
import { ScheduleCard } from "@/components/schedule/ScheduleCard";

export default function GroupDetailPage() {
  const { groupId } = useParams();
  const id = parseInt(groupId as string, 10);

  return (
    <>
      {/* 오늘의 모임용 */}
      <ScheduleCard
        type="today"
        groupName="우디 언제봐"
        scheduleTitle="금오산 등산"
        time="18:30"
      />

      {/* 다음 모임용 */}
      <ScheduleCard
        type="next"
        scheduleTitle="금오산 등산"
        time="13:30"
        dday={2}
      />

      {/* 다음 모임용 */}
      <ScheduleCard type="next" scheduleTitle="스터디" time="10:30" dday={0} />

      <GroupDetailSection groupId={id} />
      <NextScheduleCard />
    </>
  );
}
