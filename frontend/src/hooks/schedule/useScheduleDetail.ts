// src/hooks/schedule/useScheduleDetail.ts
import { useQuery } from "@tanstack/react-query";
import type { ScheduleDetail } from "@/types/schedule";
import { fetchScheduleDetail } from "@/api/schedule";

export const useScheduleDetail = (scheduleId: number) =>
  useQuery<ScheduleDetail, Error>({
    queryKey: ["schedule", scheduleId],
    queryFn: () => fetchScheduleDetail(scheduleId),
  });
