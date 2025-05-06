import { useQuery } from "@tanstack/react-query";
import { fetchTodaySchedules } from "@/api/schedule";
import type { ScheduleCalendarItem } from "@/types/schedule";

export const useTodaySchedules = (
  groupId: number,
  is_done: boolean = false
) => {
  return useQuery<ScheduleCalendarItem[], Error>({
    queryKey: ["todaySchedules", groupId, is_done],
    queryFn: () => fetchTodaySchedules(groupId, is_done),
    enabled: !!groupId,
  });
};
