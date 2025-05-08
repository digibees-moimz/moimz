"use client";

import { useParams, useRouter } from "next/navigation";
import { useAttendance } from "@/hooks/Attendance/useAttendance";
import { useAttendanceStore } from "@/stores/useAttendanceStore";
import { Typography } from "@/components/ui-components/typography/Typography";
import { Button } from "@/components/ui-components/ui/Button";
import { isQrTokenValid } from "@/utils/isQrValid";

export default function AttendanceResultPage() {
  const router = useRouter();
  const { attendanceId, groupId } = useParams();
  const id = Number(attendanceId);
  const { set, qrToken, qrTokenCreatedAt } = useAttendanceStore();
  const { useAttendanceRecord, useGenerateQr } = useAttendance();
  const { data, isLoading } = useAttendanceRecord(id);
  const { mutate: generateQr, isPending: isQrGenerating } = useGenerateQr();

  const handleGenerateQr = () => {
    if (qrToken && isQrTokenValid(qrTokenCreatedAt)) {
      router.push(`/groups/${groupId}/pay?token=${qrToken}`);
      return;
    }

    generateQr(id, {
      onSuccess: (res) => {
        const token = res.qr_token;
        const createdAt = new Date().toISOString();
        set({
          qrToken: token,
          qrTokenCreatedAt: createdAt,
          attendanceId: id,
        });
        router.push(`/groups/${groupId}/pay?token=${token}`);
      },
      onError: () => {
        alert("QR 코드 생성에 실패했어요. 다시 시도해주세요.");
      },
    });
  };

  if (isLoading || !data) return <div className="p-4">로딩 중...</div>;

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold text-center">출석 체크 확인</h1>

      <Typography.Body className="text-center text-gray-600">
        출석한 인원 {data.count}명
      </Typography.Body>

      <div className="space-y-2">
        {data.attendees.map((person) => (
          <div key={person.user_id} className="border p-2 rounded-lg">
            <p className="font-semibold">{person.name}</p>
            <p className="text-sm text-gray-500">
              락인 금액: {person.locked_amount.toLocaleString()}원
            </p>
          </div>
        ))}
      </div>

      <div className="p-4 mt-4 bg-gray-100 rounded-lg space-y-1 text-sm text-gray-800">
        <p>총 결제 가능 금액: {data.available_to_spend.toLocaleString()}원</p>
        <p>출석자 수: {data.count}명</p>
      </div>

      <div className="flex gap-2 pt-4">
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
