"use client";

import { useParams, useRouter } from "next/navigation";
import { useAttendance } from "@/hooks/useAttendance";
import { useAttendanceStore } from "@/stores/useAttendanceStore";
import { Typography } from "@/components/ui-components/typography/Typography";
import { Button } from "@/components/ui-components/ui/Button";
import { isQrTokenValid } from "@/utils/isQrValid";
import { AttendanceSummaryCard } from "@/components/attendance/AttendanceSummaryCard";
import { ConfirmedAttendeeList } from "@/components/attendance/ConfirmedAttendeeList";

export default function AttendanceResultPage() {
  const router = useRouter();
  const { attendanceId, groupId } = useParams();
  const id = Number(attendanceId);
  const { set } = useAttendanceStore();
  const { useAttendanceRecord, useGenerateQr } = useAttendance();
  const { data, isLoading } = useAttendanceRecord(id);
  const { mutate: generateQr, isPending: isQrGenerating } = useGenerateQr();

  const handleGenerateQr = () => {
    generateQr(id, {
      onSuccess: (res) => {
        const token = res.qr_token;
        const createdAt = new Date().toISOString();
        set({
          qrToken: token,
          qrTokenCreatedAt: createdAt,
          attendanceId: id,
        });
        router.push(
          `/groups/${groupId}/attendance/result/${attendanceId}/pay?token=${token}`
        );
      },
      onError: () => {
        alert("QR 코드 생성에 실패했어요. 다시 시도해주세요.");
      },
    });
  };

  if (isLoading || !data) return <div className="p-4">로딩 중...</div>;

  return (
    <div className="p-4 space-y-4">
      <Typography.Heading3>출석체크 확인</Typography.Heading3>

      <ConfirmedAttendeeList attendees={data.attendees} />

      <AttendanceSummaryCard
        attendees={data.attendees}
        count={data.count}
        availableToSpend={data.available_to_spend}
      />

      <div className="flex gap-2 pt-4 fixed bottom-0 left-0 w-full bg-white p-4">
        <Button
          className="flex-1"
          onClick={handleGenerateQr}
          disabled={isQrGenerating}
        >
          결제하러 가기
        </Button>
        <Button
          className="flex-1"
          variant="destructive"
          onClick={() => router.back()}
        >
          돌아가기
        </Button>
      </div>
    </div>
  );
}
