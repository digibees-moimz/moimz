"use client";

import { useRouter } from "next/navigation";
import { useAttendanceStore } from "@/stores/useAttendanceStore";
import { useUserStore } from "@/stores/userStore";
import { useAttendance } from "@/hooks/useAttendance";
import Image from "next/image";

export function FloatingPayButton() {
  const router = useRouter();
  const { userId } = useUserStore();
  const { attendanceId, groupId, qrToken } = useAttendanceStore();

  const { useAttendanceRecord } = useAttendance();
  const { data, isLoading } = useAttendanceRecord(attendanceId ?? -1);

  // 출석자인지 확인
  const isAttendee = data?.attendees?.some((a) => a.user_id === userId);

  // 렌더링 조건
  const shouldShow =
    !!isAttendee &&
    !!groupId &&
    !!attendanceId &&
    !!qrToken &&
    data?.is_closed === false;

  if (!shouldShow || isLoading) return null;

  return (
    <button
      className="fixed bottom-6 right-6 w-20 h-20 rounded-full bg-[#DFCDF9]/80 flex items-center justify-center shadow-md hover:bg-[#CDABFF]/60 p-1 z-30"
      onClick={() =>
        router.push(
          `/groups/${groupId}/attendance/result/${attendanceId}/pay?token=${qrToken}`
        )
      }
    >
      <Image src="/icons/card.png" alt="결제 아이콘" width={75} height={75} />
    </button>
  );
}
