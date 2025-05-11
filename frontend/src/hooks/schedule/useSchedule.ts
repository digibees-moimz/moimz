import { useQuery } from "@tanstack/react-query";
import { fetchPendingSchedule } from "@/api/schedule";
import type { PendingSchedule } from "@/types/schedule";

export const useSchedule = () => {
  // 출석체크 12시간 경과 후에도 종료되지 않은 일정 조회
  const usePendingSchedule = (groupId: number) => {
    return useQuery<PendingSchedule | null>({
      queryKey: ["pending-schedule", groupId],
      queryFn: () => fetchPendingSchedule(groupId),
    });
  };
  return {
    usePendingSchedule,
  };
};
