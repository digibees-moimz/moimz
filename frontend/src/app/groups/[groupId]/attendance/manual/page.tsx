// src/app/attendance/manual/page.tsx
"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAttendanceStore } from "@/stores/useAttendanceStore";
import { useAttendance } from "@/hooks/Attendance/useAttendance";
import { ManualAttendanceRequest } from "@/types/attendance";
import { useGroupAccountSummary } from "@/hooks/useGroupAccountSummary";
import { useTodaySchedules } from "@/hooks/schedule/useUpcomingSchedule";
import { Button } from "@/components/ui-components/ui/Button";
import { GroupMembers } from "@/components/attendance/GroupMembers";
import { Typography } from "@/components/ui-components/typography/Typography";
import { ScheduleSelector } from "@/components/attendance/ScheduleSelector";

export default function ManualAttendancePage() {
  const router = useRouter();
  const { groupId: groupIdParam } = useParams();
  const groupIdNum = Number(groupIdParam);
  const { groupId, scheduleId, set } = useAttendanceStore();
  const { useManualAttendance, useCompleteAttendance } = useAttendance();

  useEffect(() => {
    if (groupIdNum && groupIdNum !== groupId) {
      set({ groupId: groupIdNum });
      groupIdNum;
    }
  }, [groupIdNum, groupId, set]);

  const { data: summary } = useGroupAccountSummary(groupId);
  const members = summary?.members || [];

  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [selectedScheduleId, setSelectedScheduleId] = useState<number | null>(
    null
  );
  const { data: todaySchedules } = useTodaySchedules(groupId);

  const { mutate: submitManualAttendance, isPending } = useManualAttendance();
  const { mutate: submitCompleteAttendance, isPending: isCompleting } =
    useCompleteAttendance();

  const handleSubmit = () => {
    const request: ManualAttendanceRequest = {
      group_id: groupId,
      user_ids: selectedIds,
    };

    submitManualAttendance(request, {
      onSuccess: (res) => {
        // 수동 출석 결과 상태 저장
        set({
          attendees: res.attendees,
          type: "manual",
          availableToSpend: res.available_to_spend,
          userIds: res.user_ids,
        });

        // 곧바로 출석 확정 API 호출
        submitCompleteAttendance(
          {
            group_id: groupId,
            schedule_id: scheduleId ?? undefined,
            user_ids: res.user_ids,
            check_type: "manual",
          },
          {
            onSuccess: (res) => {
              set({ attendanceId: res.attendance_id });
              router.push(
                `/groups/${groupId}/attendance/result/${res.attendance_id}`
              );
            },
          }
        );
      },
    });
  };

  return (
    <div className="p-4 space-y-4 pb-32">
      <h1 className="text-xl font-bold">수동 출석체크</h1>

      <ScheduleSelector
        schedules={todaySchedules || []}
        selectedScheduleId={selectedScheduleId}
        onSelect={setSelectedScheduleId}
      />

      <Typography.Body className="text-gray-700 pt-3">
        선택된 인원 - {selectedIds.length}명
      </Typography.Body>

      {/* 출석자 선택 리스트 */}
      <div className="space-y-3">
        {members.map((member) => {
          const id = member.user_account_id;
          return (
            <GroupMembers
              key={id}
              member={member}
              isSelected={selectedIds.includes(id)}
              onToggle={() => {
                setSelectedIds((prev) =>
                  prev.includes(id)
                    ? prev.filter((x) => x !== id)
                    : [...prev, id]
                );
              }}
            />
          );
        })}
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-sm px-2 py-4 bg-white">
        <div className="flex flex-col gap-3">
          <Button
            onClick={handleSubmit}
            disabled={isPending || isCompleting || selectedIds.length === 0}
          >
            출석체크
          </Button>
        </div>
      </div>
    </div>
  );
}
