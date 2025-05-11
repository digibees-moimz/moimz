// src/hooks/useScheduleAction.ts

import { useMutation } from "@tanstack/react-query";
import { completeSchedule } from "@/api/schedule";
import {
  showSuccessToast,
  showInfoToast,
  showErrorToast,
} from "@/components/ui-components/ui/Toast";

interface EndScheduleOptions {
  scheduleId: number;
  groupId: number;
  userId: number;
  onComplete?: () => void; // Optional 후처리 콜백
}

export function useScheduleAction() {
  const { mutate: handleEndSchedule, isPending } = useMutation({
    mutationFn: ({ scheduleId, groupId, userId }: EndScheduleOptions) =>
      completeSchedule(scheduleId, groupId, userId),

    onSuccess: (data, variables) => {
      showSuccessToast(data.message);
      if (data.diary_id) {
        showSuccessToast("모임 일기가 커뮤니티에 등록 되었어요! 😊");
      } else {
        showInfoToast("출석자가 없어 일기는 생성되지 않았어요.");
      }

      variables.onComplete?.();
    },

    onError: () => {
      showErrorToast("모임 일정 종료에 실패했어요. 다시 시도해주세요 🥲");
    },
  });

  return {
    handleEndSchedule,
    isPending,
  };
}
