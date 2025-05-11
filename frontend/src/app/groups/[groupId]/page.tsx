// src/app/groups/[groupId]/page.tsx

"use client";

import { useParams } from "next/navigation";
import GroupDetailSection from "@/components/group/GroupDetailSection";
import { useUserStore } from "@/stores/userStore";
import { ScheduleCard } from "@/components/schedule/ScheduleCard";
import { ScheduleEndBtn } from "@/components/schedule/ScheduleEndBtn";
import { useGroupUpcomingSchedule } from "@/hooks/schedule/useUpcomingSchedule";
import { formatTimeOnly, getDdayLabel } from "@/utils/formatDate";
import CharacterGenerateButton from "@/components/character/CharacterGenerateButton";
import { useGroups } from "@/hooks/useGroups";
import { useSchedule } from "@/hooks/schedule/useSchedule";


export default function GroupDetailPage() {
  const { groupId } = useParams<{ groupId: string }>();
  const groupIdNum = Number(groupId);

  const { userId } = useUserStore();
  const { data: groups, refetch: refetchGroup } = useGroups(userId);

  const { usePendingSchedule } = useSchedule();
  const { data: pending } = usePendingSchedule(groupIdNum);

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

      {pending && (
        <ScheduleEndBtn
          schedule={pending}
          groupId={groupIdNum}
          userId={userId}
        />
      )}

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
