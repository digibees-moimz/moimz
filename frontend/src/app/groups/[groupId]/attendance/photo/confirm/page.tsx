"use client";

import { useAttendance } from "@/hooks/Attendance/useAttendance";
import { useAttendanceStore } from "@/stores/useAttendanceStore";
import { useRouter, useParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui-components/ui/Button";
import { Typography } from "@/components/ui-components/typography/Typography";
import { AttendanceMemberList } from "@/components/attendance/AttendanceMemberList";
import { ScheduleSelector } from "@/components/attendance/ScheduleSelector";
import { Flex } from "@/components/ui-components/layout/Flex";

export default function PhotoConfirmPage() {
  const { groupId } = useParams();
  const router = useRouter();
  const { useCompleteAttendance } = useAttendance();
  const {
    groupId: gid,
    imageUrl,
    attendees,
    userIds,
    set,
  } = useAttendanceStore();

  const [selectedIds, setSelectedIds] = useState<number[]>(userIds || []);
  const [selectedScheduleId, setSelectedScheduleId] = useState<number | null>(
    null
  );
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const { mutate: completeAttendance, isPending } = useCompleteAttendance();

  const handleSubmit = () => {
    completeAttendance(
      {
        group_id: gid,
        user_ids: selectedIds,
        check_type: "photo",
        image_url: imageUrl,
        schedule_id: selectedScheduleId || undefined,
      },
      {
        onSuccess: (res) => {
          router.push(
            `/groups/${groupId}/attendance/result/${res.attendance_id}`
          );
          set({
            attendanceId: res.attendance_id,
          });
        },
      }
    );
  };

  return (
    <>
      <Typography.Heading3>사진 출석체크</Typography.Heading3>

      {/* 사진 미리보기 */}
      {imageUrl && (
        <img
          src={`http://localhost:8000${imageUrl}`}
          alt="출석 예측 이미지"
          className="w-full rounded-xl shadow mb-4"
        />
      )}

      {/* 참석자 선택 */}
      <Flex.RowBetweenCenter className="pt-4">
        <Typography.Body className="text-gray-700">
          출석된 인원 {selectedIds.length}명
        </Typography.Body>
        {isEditable ? (
          <button
            className="text-sm text-[#7BABFF] p-1 font-bold"
            onClick={() => setIsEditable(false)}
          >
            수정 완료
          </button>
        ) : (
          <button
            className="text-sm text-[#7BABFF] p-1 font-bold"
            onClick={() => setIsEditable(true)}
          >
            출석자 수정
          </button>
        )}
      </Flex.RowBetweenCenter>

      <AttendanceMemberList
        members={attendees.map((a) => ({
          user_account_id: a.user_id,
          name: a.name,
          profile_image_url: "", // 없으면 기본값으로 처리
          locked_amount: a.locked_amount,
        }))}
        selectedIds={selectedIds}
        onToggle={
          isEditable
            ? (id) =>
                setSelectedIds((prev) =>
                  prev.includes(id)
                    ? prev.filter((x) => x !== id)
                    : [...prev, id]
                )
            : () => {} // 수정 불가 상태일 땐 아무 동작도 하지 않음
        }
      />

      {/* 일정 선택 */}
      <ScheduleSelector
        selectedScheduleId={selectedScheduleId}
        onSelect={(id) => {
          setSelectedScheduleId(id);
          set({ scheduleId: id });
        }}
      />

      {/* 하단 버튼 */}
      <div>
        <Button
          onClick={handleSubmit}
          disabled={isPending || selectedIds.length === 0}
        >
          출석 완료하기
        </Button>
      </div>
    </>
  );
}
