"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useAttendanceStore } from "@/stores/useAttendanceStore";
import { useAttendance } from "@/hooks/useAttendance";
import { AttendanceSummaryCard } from "@/components/attendance/AttendanceSummaryCard";
import { Button } from "@/components/ui-components/ui/Button";
import { getTokenRemainingSeconds } from "@/utils/isQrValid";
import { LoadingBar } from "@/components/ui-components/shared/LoadingBar";

export default function PayPage() {
  const router = useRouter();
  const { qrToken, qrTokenCreatedAt, set } = useAttendanceStore();

  // 출석 및 그룹 ID
  const params = useParams();
  const attendanceId = Number(params.attendanceId);
  const groupId = Number(params.groupId);

  // QR 토큰
  const searchParams = useSearchParams();
  const urlToken = searchParams.get("token");
  const token = urlToken || qrToken;

  const createdAt = qrTokenCreatedAt;

  const [remaining, setRemaining] = useState<number | null>(null);
  const [hasMounted, setHasMounted] = useState(false);

  // 출석 정보 다시 가져오기
  const { useAttendanceRecord, useGenerateQr } = useAttendance();
  const { data, isLoading, refetch } = useAttendanceRecord(attendanceId ?? -1);
  const { mutate: generateQr, isPending } = useGenerateQr();

  useEffect(() => {
    setHasMounted(true); // hydration-safe 렌더링
  }, []);

  useEffect(() => {
    if (!createdAt) return;
    const updateRemaining = () => {
      const secs = getTokenRemainingSeconds(createdAt);
      setRemaining(secs > 0 ? secs : 0);
    };
    updateRemaining();
    const interval = setInterval(updateRemaining, 1000);
    return () => clearInterval(interval);
  }, [createdAt]);

  const handleRegen = () => {
    if (!attendanceId) return;
    generateQr(attendanceId, {
      onSuccess: (res) => {
        const newToken = res.qr_token;
        const now = new Date().toISOString();
        set({
          qrToken: newToken,
          qrTokenCreatedAt: now,
          attendanceId,
        });
        refetch();
        router.replace(
          `/groups/${groupId}/attendance/result/${attendanceId}/pay?token=${newToken}`
        );
      },
      onError: () => alert("QR 재생성 실패"),
    });
  };

  if (!hasMounted) return null; // hydration mismatch 방지
  if (!token || !attendanceId)
    return <div className="p-4">잘못된 접근입니다.</div>;
  if (isLoading || !data) return <LoadingBar />;

  // QR코드 이미지 조회 API 주소
  const qrImageUrl = `http://localhost:8000/api/attendance/qr/image/${token}`;

  // QR코드 재성성 가능 여부
  const isExpired = remaining === 0;
  const isUsed = data?.qrcode_used;
  const isClosed = data?.is_closed;
  const shouldAllowRegen = !isClosed && (isUsed || isExpired);

  return (
    <div className="pt-4 space-y-4 pb-32">
      <h1 className="text-xl font-bold text-center">N등분 결제 QR</h1>

      <div className="text-center text-sm text-gray-600">
        {!shouldAllowRegen && remaining !== null && remaining > 0 && (
          <>
            만료까지 남은 시간:{" "}
            <span className="text-[#22BD9C]">
              {Math.floor(remaining / 60)}분 {remaining % 60}초
            </span>
          </>
        )}
      </div>

      {/* QR 이미지 or 안내 메시지 */}
      <div className="flex justify-center min-h-[12rem] items-center">
        {!shouldAllowRegen ? (
          <img src={qrImageUrl} alt="QR 이미지" className="w-48 h-48" />
        ) : (
          <>
            <img
              src={`/icons/together2.png`}
              alt="QR 이미지"
              className="h-48"
            />
          </>
        )}
      </div>

      {!shouldAllowRegen ? (
        <p className="text-center text-sm text-gray-500">
          이 QR코드를 스캔해 결제를 진행하세요.
        </p>
      ) : isUsed ? (
        <p className="text-[#22BD9C] text-center text-sm">
          QR 코드를 다시 생성해주세요
        </p>
      ) : (
        <p className="text-gray-500 text-center text-sm">
          QR 코드가 만료되었습니다
        </p>
      )}

      <div className="pt-5">
        <AttendanceSummaryCard
          attendees={data.attendees}
          count={data.count}
          availableToSpend={data.available_to_spend}
        />
      </div>

      {shouldAllowRegen && (
        <div className="fixed bottom-0 left-0 w-full bg-white p-4">
          <Button
            onClick={handleRegen}
            disabled={!shouldAllowRegen || isPending}
          >
            QR 코드 재생성
          </Button>
        </div>
      )}
    </div>
  );
}
