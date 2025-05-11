// src/hooks/useScheduleAction.ts

import axios from "@/lib/axios";
import { useRouter } from "next/navigation";
import { useDiary } from "@/hooks/useDiary";
import {
  showSuccessToast,
  showErrorToast,
} from "@/components/ui-components/ui/Toast";

interface EndScheduleOptions {
  scheduleId: number;
  groupId: number;
  userId: number;
  onComplete?: () => void; // Optional 후처리 콜백
}

export function useScheduleAction() {
  const router = useRouter();
  const { useGenerateDiaryAuto } = useDiary();
  const { mutate: generateDiary } = useGenerateDiaryAuto();

  const handleEndSchedule = async ({
    scheduleId,
    groupId,
    userId,
    onComplete,
  }: EndScheduleOptions) => {
    try {
      // 1. 일정 종료
      await axios.patch(`/api/schedules/${scheduleId}/done`);
      showSuccessToast("일정이 종료되었어요! 즐거운 모임 되셨나요?😊");


      // 2. 연결된 출석 조회
      const res = await axios.get(`/api/schedules/${scheduleId}/attendance`);
      const attendance = res.data;

      if (attendance?.id) {
        // 3. 출석이 있다면 일기 생성
        generateDiary(
          {
            group_id: groupId,
            schedule_id: scheduleId,
            attendance_id: attendance.id,
            user_id: userId,
          },
          {
            onSuccess: (diary) => {
              showSuccessToast("모임 일기가 커뮤니티에 등록 되었어요!");
              if (onComplete) onComplete();
              else router.push(`/groups/${groupId}/diaries/${diary.id}`);
            },
            onError: () => {
              showErrorToast("일기 생성에 실패했어요 🥲");
            },
          }
        );
      } else {
        onComplete?.();
      }
    } catch (err) {
      console.error(err);
      showErrorToast("일정 종료에 실패했어요. 다시 시도해주세요");
    }
  };

  return {
    handleEndSchedule,
  };
}
