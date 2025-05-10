"use client";

import { useSearchParams } from "next/navigation";
import { useAttendanceStore } from "@/stores/useAttendanceStore";
import { useAttendance } from "@/hooks/Attendance/useAttendance";
import { AttendanceSummaryCard } from "@/components/attendance/AttendanceSummaryCard";

export default function PayPage() {
  const { attendanceId } = useAttendanceStore();
  const { useAttendanceRecord } = useAttendance();

  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  if (!token || !attendanceId) {
    return <div className="p-4">잘못된 접근입니다.</div>;
  }

  const { data, isLoading } = useAttendanceRecord(attendanceId);

  if (isLoading || !data) {
    return <div className="p-4">로딩 중입니다...</div>;
  }

  if (!token) return <div className="p-4">잘못된 접근입니다.</div>;

  const qrImageUrl = `http://localhost:8000/api/attendance/qr/image/${token}`; // API URL

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold text-center">N등분 결제 QR</h1>

      <div className="flex justify-center">
        <img src={qrImageUrl} alt="QR 이미지" className="w-48 h-48" />
      </div>

      <p className="text-center text-sm text-gray-500">
        이 QR코드를 스캔해 결제를 진행하세요.
      </p>

      <AttendanceSummaryCard
        attendees={data.attendees}
        count={data.count}
        availableToSpend={data.available_to_spend}
      />
    </div>
  );
}
