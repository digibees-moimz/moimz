"use client";

import { useRouter } from "next/navigation";
import { useAttendanceStore } from "@/stores/useAttendanceStore";
import { useUserStore } from "@/stores/userStore";
import Image from "next/image";

export function FloatingPayButton() {
  const router = useRouter();
  const { userId } = useUserStore();
  const { attendanceId, attendees, groupId } = useAttendanceStore();
  console.log({ attendanceId, attendees, groupId, userId });

  const isAttendee = attendees.some((a) => a.user_id === userId);

  if (!isAttendee || !attendanceId || !groupId) return null;

  return (
    <button
      className="fixed bottom-6 right-6 w-20 h-20 rounded-full bg-[#DFCDF9]/80 flex items-center justify-center shadow-md hover:bg-[#CDABFF]/60 p-1 z-30"
      onClick={() => router.push(`/groups/${groupId}/pay`)}
    >
      <Image src="/icons/card.png" alt="지도 아이콘" width={75} height={75} />
    </button>
  );
}
