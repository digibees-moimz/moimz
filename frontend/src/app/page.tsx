// src/app/page.tsx
"use client";

import { formatTimeOnly, getDdayLabel } from "@/utils/formatDate";
import { ScheduleCard } from "@/components/schedule/ScheduleCard";
import { Typography } from "@/components/ui-components/typography/Typography";
import GroupList from "@/components/group/GroupList";
import { useUserStore } from "@/stores/userStore";
import {
  useTodaySchedule,
  useUpcomingSchedule,
} from "@/hooks/schedule/useUpcomingSchedule";

export default function HomePage() {
  const { userId } = useUserStore();
  const { data: today } = useTodaySchedule(userId);
  const { data: next } = useUpcomingSchedule(userId);

  return (
    <>
      <div className="space-y-6">
        {today && (
          <ScheduleCard
            type="today"
            groupName={today.group_name}
            scheduleTitle={today.title}
            time={formatTimeOnly(today.date)}
            dday={getDdayLabel(today.date)}
          />
        )}

        {!today && next && (
          <ScheduleCard
            type="next"
            scheduleTitle={next.title}
            time={formatTimeOnly(next.date)}
            dday={getDdayLabel(next.date)}
          />
        )}
      </div>
      <Typography.Heading3 className="m-2">내 모임통장</Typography.Heading3>
      <GroupList />
    </>
  );
}
