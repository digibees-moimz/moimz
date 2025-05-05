// src/hooks/schedule/useScheduleCreate.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios_past";
import type { ScheduleCreateInput, ScheduleItem } from "@/types/schedule";

/**
 * 일정 생성 훅 – axios & react‑query 기반
 * @param groupId 해당 그룹 PK
 */
export const useScheduleCreate = (groupId: number) => {
  const qc = useQueryClient();

  return useMutation<ScheduleItem, Error, ScheduleCreateInput>({
    /**
     * POST /api/schedules
     * body: { group_id, title, date, time, ... }
     */
    mutationFn: async (payload) => {
      const { data } = await axiosInstance.post<ScheduleItem>(
        "/api/schedules",
        {
          group_id: groupId,
          ...payload,
        }
      );
      return data;
    },

    // 캐시 무효화 → 월간 일정 다시 조회하도록
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["monthlySchedules", groupId] });
    },
  });
};
