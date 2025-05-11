// src/app/groups/[groupId]/page.tsx

"use client";

import { useParams } from "next/navigation";
import GroupDetailSection from "@/components/group/GroupDetailSection";
import { useUserStore } from "@/stores/userStore";
import NextScheduleCard from "@/components/scheduleDetail/NextScheduleCard";
import { ScheduleCard } from "@/components/schedule/ScheduleCard";
import { useGroupUpcomingSchedule } from "@/hooks/schedule/useUpcomingSchedule";
import { formatTimeOnly, getDdayLabel } from "@/utils/formatDate";
import CharacterGenerateButton from "@/components/character/CharacterGenerateButton";
import { useGroups } from "@/hooks/useGroups";
import TabNav from "@/components/layout/TabNav";

export default function GroupDetailPage() {
  const { groupId } = useParams<{ groupId: string }>();
  const groupIdNum = Number(groupId);

  const { userId } = useUserStore();
  const { data: groups, refetch: refetchGroup } = useGroups(userId);
  const group = groups?.find((g) => g.id === groupIdNum);

  if (isNaN(groupIdNum)) return <div>잘못된 그룹입니다.</div>;

  const { data: next } = useGroupUpcomingSchedule(groupIdNum);
  return (
    <>
      {/* 모임통장 상세 */}
      <GroupDetailSection group={group} />
      <CharacterGenerateButton
        groupId={groupIdNum}
        onGenerated={() => refetchGroup()}
      />
      {/* 다음 일정 */}
      {next && (
        <ScheduleCard
          type="next"
          groupId={groupIdNum}
          scheduleTitle={next.title}
          time={formatTimeOnly(next.date)}
          dday={getDdayLabel(next.date)}
        />
      )}
    </>
  );
}
