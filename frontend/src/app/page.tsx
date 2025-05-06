// src/app/page.tsx
"use client";

import { useUserStore } from "@/stores/userStore";
import {
  useTodaySchedule,
  useUpcomingSchedule,
} from "@/hooks/schedule/useUpcomingSchedule";
import { ScheduleCard } from "@/components/schedule/ScheduleCard";
import { Typography } from "@/components/ui-components/typography/Typography";
import GroupList from "@/components/group/GroupList";
import { formatTimeOnly, getDdayLabel } from "@/utils/formatDate";

export default function HomePage() {
  const { userId } = useUserStore();
  const { data: today } = useTodaySchedule(userId);
  const { data: next } = useUpcomingSchedule(userId);

  console.log(userId, today, next);

  return (
    <>
      {/* <div className="space-y-6">
        {today && (
          <ScheduleCard
            type="today"
            groupName={""}
            scheduleTitle={today.title}
            time={formatTimeOnly(today.date)}
            dday="D-Day"
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
      </div> */}
      <Typography.Heading3 className="m-2">내 모임통장</Typography.Heading3>
      <GroupList />
    </>
  );
}
