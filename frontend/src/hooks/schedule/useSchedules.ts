// src/hooks/schedule/useSchedules.ts
import { useQuery } from "@tanstack/react-query";
import { ScheduleDetail } from "@/types/schedule";
import { fetchSchedulesByGroup } from "@/api/schedule";

export function useSchedules(groupId: number) {
  return useQuery<ScheduleDetail[]>({
    queryKey: ["schedules", groupId],
    queryFn: () => fetchSchedulesByGroup(groupId),
    enabled: !!groupId,
  });
}
