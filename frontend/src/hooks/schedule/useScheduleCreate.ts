// src/hooks/schedule/useScheduleCreate.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSchedule } from "@/api/schedule";
import type { ScheduleCreateInput, ScheduleItem } from "@/types/schedule";

export const useScheduleCreate = (groupId: number) => {
  const qc = useQueryClient();

  return useMutation<ScheduleItem, Error, ScheduleCreateInput>({
    mutationFn: (payload) => createSchedule(groupId, payload),

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["schedules", groupId] });
    },
  });
};
