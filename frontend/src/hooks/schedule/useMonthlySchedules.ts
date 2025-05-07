// src/hooks/schedule/useMonthlySchedules.ts
import { useQuery } from "@tanstack/react-query";
import { fetchMonthlySchedules } from "@/api/schedule";
import type { ScheduleCardItem } from "@/types/schedule";

export const useMonthlySchedules = (
  groupId: number,
  year: number,
  month: number
) => {
  return useQuery<ScheduleCardItem[]>({
    queryKey: ["schedules", groupId, year, month],
    queryFn: () => fetchMonthlySchedules(groupId, year, month),
  });
};
