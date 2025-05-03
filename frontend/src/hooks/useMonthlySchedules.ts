// src/hooks/useMonthlySchedules.ts
import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";
import type { ScheduleItem } from "@/types/schedule";

export const useMonthlySchedules = (
  groupId: number,
  year: number,
  month: number
) => {
  return useQuery({
    queryKey: ["schedules", groupId, year, month],
    queryFn: async (): Promise<ScheduleItem[]> => {
      const { data } = await axios.get<ScheduleItem[]>(
        `/api/schedules/group/${groupId}/monthly`,
        { params: { year, month } }
      );
      return data;
    },
  });
};
