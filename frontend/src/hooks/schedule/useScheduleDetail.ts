// src/hooks/schedule/useScheduleDetail.ts
import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";
import type { ScheduleDetail } from "@/types/schedule";

export const useScheduleDetail = (scheduleId: number) => {
  return useQuery<ScheduleDetail, Error>({
    queryKey: ["schedule", scheduleId],
    queryFn: async () => {
      const { data } = await axios.get<ScheduleDetail>(
        `/api/schedules/${scheduleId}`
      );
      return data;
    },
  });
};
