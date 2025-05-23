// src/app/page.tsx
"use client";

import { formatTimeOnly, getDdayLabel } from "@/utils/formatDate";
import { ScheduleCard } from "@/components/schedule/ScheduleCard";
import { FloatingPayButton } from "@/components/pay/FloatingPayButton";
import { Typography } from "@/components/ui-components/typography/Typography";
import { LoadingBar } from "@/components/ui-components/shared/LoadingBar";
import GroupList from "@/components/group/GroupList";
import { useUserStore } from "@/stores/userStore";
import {
  useTodaySchedule,
  useUpcomingSchedule,
} from "@/hooks/schedule/useUpcomingSchedule";
import { useGroups } from "@/hooks/useGroups";

export default function HomePage() {
  const { userId } = useUserStore();
  const { data: today } = useTodaySchedule(userId);
  const { data: next } = useUpcomingSchedule(userId);
  const { data: groups, isLoading, error } = useGroups(userId);

  return (
    <>
      {/* 오늘의 모임 / 다음 모임 */}
      <div className="space-y-6">
        {today && (
          <ScheduleCard
            type="today"
            groupId={today.group_id}
            groupName={today.group_name}
            scheduleTitle={today.title}
            time={formatTimeOnly(today.date)}
            dday={getDdayLabel(today.date)}
          />
        )}

        {!today && next && (
          <ScheduleCard
            type="next"
            groupId={next.group_id}
            scheduleTitle={next.title}
            time={formatTimeOnly(next.date)}
            dday={getDdayLabel(next.date)}
          />
        )}
      </div>

      <Typography.Heading3 className="m-2">내 모임통장</Typography.Heading3>

      {isLoading ? (
        <LoadingBar />
      ) : error ? (
        <p>에러: {error.message}</p>
      ) : groups ? (
        <GroupList groups={groups} />
      ) : (
        <p>모임 없음</p>
      )}

      {/* 결제 버튼 */}
      <FloatingPayButton />
    </>
  );
}
