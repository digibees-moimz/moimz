// src/hooks/schedule/useScheduleComment.ts
import { useMutation } from "@tanstack/react-query";
import { postScheduleComment } from "@/api/schedule";
import type { ScheduleCommentCreateInput } from "@/types/comment";

export function useScheduleComment(scheduleId: number) {
  return useMutation({
    mutationFn: (input: ScheduleCommentCreateInput) =>
      postScheduleComment(scheduleId, input),
  });
}
