// src/hooks/schedule/useSchedules.ts
import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { ScheduleDetail } from "@/types/schedule";

export function useSchedules(groupId: number) {
  return useQuery<ScheduleDetail[]>({
    queryKey: ["schedules", groupId],
    queryFn: () => axios.get(`/api/schedules/group/${groupId}`),
    enabled: !!groupId, // groupId 없으면 호출 방지
  });
}
