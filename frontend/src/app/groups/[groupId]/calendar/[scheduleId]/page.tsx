// src/app/groups/[groupId]/calendar/[scheduleId]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { useScheduleDetail } from "@/hooks/schedule/useScheduleDetail";
import ScheduleDetail from "@/components/scheduleDetail/ScheduleDetail";
import TransactionList from "@/components/transaction/TransactionList";
import ScheduleCommentSection from "@/components/scheduleDetail/ScheduleCommentSection";
import { LoadingBar } from "@/components/ui-components/shared/LoadingBar";

export default function SchedulePage() {
  const { scheduleId } = useParams();
  const {
    data: schedule,
    isLoading,
    error,
    refetch,
  } = useScheduleDetail(Number(scheduleId));

  if (isLoading) return <LoadingBar />;

  if (error || !schedule)
    return (
      <div className="p-4 text-center text-red-500">
        일정을 불러올 수 없습니다.
      </div>
    );

  return (
    <>
      <ScheduleDetail schedule={schedule} onRefetch={refetch} />
      <TransactionList transactions={schedule.transactions} />
      <ScheduleCommentSection schedule={schedule} onRefetch={refetch} />
    </>
  );
}
