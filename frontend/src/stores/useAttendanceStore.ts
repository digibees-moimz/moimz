// useAttendanceStore.ts
import { create } from "zustand";
import { AttendanceCheckType } from "@/types/attendance";

// 출석자 정보 타입
interface Attendee {
  user_id: number;
  name: string;
  locked_amount: number;
  similarity?: number; // 사진 출석일 경우
}

interface AttendanceStore {
  attendanceId: number | null; // 출석 완료 후 받은 ID
  groupId: number;
  scheduleId: number | null;
  type: AttendanceCheckType; // "photo" | "manual"
  attendees: Attendee[]; // 선택된 출석자 명단
  imageUrl?: string; // 사진 출석용 이미지
  photoFile?: File; // 사진 파일 (선택적으로)

  // 상태 업데이트
  set: (data: Partial<AttendanceStore>) => void;

  // 출석 초기화
  reset: () => void;
}

export const useAttendanceStore = create<AttendanceStore>((set) => ({
  attendanceId: null,
  groupId: 0,
  scheduleId: null,
  type: "photo",
  attendees: [],
  imageUrl: undefined,
  photoFile: undefined,

  set: (data) => set((state) => ({ ...state, ...data })),

  reset: () =>
    set({
      attendanceId: null,
      groupId: 0,
      scheduleId: null,
      type: "photo",
      attendees: [],
      imageUrl: undefined,
      photoFile: undefined,
    }),
}));
