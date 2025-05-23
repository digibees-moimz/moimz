// useAttendanceStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
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
  userIds: number[];
  availableToSpend: number;
  imageUrl?: string; // 사진 출석용 이미지
  uploadedPhoto?: File; // 사진 파일
  qrToken?: string;
  qrTokenCreatedAt?: string;

  set: (data: Partial<AttendanceStore>) => void;
  reset: () => void;
}

export const useAttendanceStore = create<AttendanceStore>()(
  persist(
    (set) => ({
      attendanceId: null,
      groupId: 0,
      scheduleId: null,
      type: "photo",
      attendees: [],
      userIds: [],
      availableToSpend: 0,
      imageUrl: undefined,
      uploadedPhoto: undefined,
      qrToken: undefined,
      qrTokenCreatedAt: undefined,

      set: (data) => set((state) => ({ ...state, ...data })),
      reset: () =>
        set({
          attendanceId: null,
          groupId: 0,
          scheduleId: null,
          type: "photo",
          attendees: [],
          userIds: [],
          availableToSpend: 0,
          imageUrl: undefined,
          uploadedPhoto: undefined,
          qrToken: undefined,
          qrTokenCreatedAt: undefined,
        }),
    }),
    {
      name: "attendance-storage", // 로컬스토리지 키 이름
      partialize: (state) => ({
        attendanceId: state.attendanceId,
        groupId: state.groupId,
        scheduleId: state.scheduleId,
        attendees: state.attendees,
        userIds: state.userIds,
        availableToSpend: state.availableToSpend,
        type: state.type,
        imageUrl: state.imageUrl,
        qrToken: state.qrToken,
        qrTokenCreatedAt: state.qrTokenCreatedAt,
      }),
    }
  )
);
