// src/app/groups/group[Id]/attendance/photo/confirm/page.tsx
"use client";

import { useAttendance } from "@/hooks/useAttendance";
import { useAttendanceStore } from "@/stores/useAttendanceStore";
import { useGroupAccountSummary } from "@/hooks/useGroupAccountSummary";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui-components/ui/Button";
import { Typography } from "@/components/ui-components/typography/Typography";
import { AttendanceMemberList } from "@/components/attendance/AttendanceMemberList";
import { ScheduleSelector } from "@/components/attendance/ScheduleSelector";
import { Flex } from "@/components/ui-components/layout/Flex";

export default function PhotoConfirmPage() {
  const { groupId } = useParams();
  const router = useRouter();
  const { useCompleteAttendance } = useAttendance();
  const { groupId: gid, imageUrl, userIds, set } = useAttendanceStore();

  const { data: groupSummary } = useGroupAccountSummary(gid);
  const groupMembers = groupSummary?.members || [];

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
          set({
            attendanceId: res.attendance_id,
          });
          router.push(
            `/groups/${groupId}/attendance/result/${res.attendance_id}`
          );
        },
      }
    );
  };

  const displayMembers = isEditable
    ? groupMembers.sort((a, b) => {
        const aSelected = selectedIds.includes(a.user_account_id);
        const bSelected = selectedIds.includes(b.user_account_id);
        return Number(bSelected) - Number(aSelected);
      })
    : groupMembers.filter((m) => selectedIds.includes(m.user_account_id));

  return (
    <>
      <Typography.Heading3>사진 출석체크</Typography.Heading3>

      {/* 일정 선택 */}
      <ScheduleSelector
        selectedScheduleId={selectedScheduleId}
        onSelect={(id) => {
          setSelectedScheduleId(id);
          set({ scheduleId: id });
        }}
      />

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
        members={displayMembers}
        selectedIds={selectedIds}
        onToggle={
          isEditable
            ? (id) =>
                setSelectedIds((prev) =>
                  prev.includes(id)
                    ? prev.filter((x) => x !== id)
                    : [...prev, id]
                )
            : () => {}
        }
      />

      {/* 하단 버튼 */}
      <div className="w-full max-w-sm">
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
