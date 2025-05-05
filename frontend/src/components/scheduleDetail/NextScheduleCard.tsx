"use client";

import { useSchedules } from "@/hooks/schedule/useSchedules"; // 경로 확인!
import { useParams } from "next/navigation";
import { format, differenceInDays } from "date-fns";
import { ko } from "date-fns/locale";
import { Typography } from "@/components/ui-components/typography/Typography";
import { Flex } from "@/components/ui-components/layout/Flex";
import { Button } from "@/components/ui-components/ui/Button";
import { FcClock } from "react-icons/fc";

export default function NextScheduleCard() {
  const { groupId } = useParams();
  const group_id = parseInt(groupId as string, 10);

  const { data: schedules, isLoading, error } = useSchedules(group_id);

  if (isLoading) return null;
  if (error || !schedules) return null;

  // 📌 가장 가까운 미래 일정 1개 뽑기
  const now = new Date();
  const upcoming = schedules
    .filter((s) => !s.is_done && new Date(s.date) > now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

  if (!upcoming) return null;

  const date = new Date(upcoming.date);
  const dDay = differenceInDays(date, now);
  const time = format(date, "HH:mm", { locale: ko });

  return (
    <div className="mt-6 px-4 w-full">
      <Typography.BodySmall className="text-gray-500 mb-1">
        다음 모임은?
      </Typography.BodySmall>

      <div className="bg-[#F1FFF3] rounded-xl p-4 flex flex-col gap-2 shadow-sm">
        <Flex.RowBetweenCenter>
          <Typography.Body className="font-bold text-[#1B8871]">
            {upcoming.title}
          </Typography.Body>
          <Typography.BodySmall className="text-gray-400">
            <span className="inline-flex items-center gap-1">
              D - {dDay} <FcClock size={16} /> {time}
            </span>
          </Typography.BodySmall>
        </Flex.RowBetweenCenter>

        <Flex.RowBetweenCenter className="gap-2">
          <Button
            size="sm"
            variant="primary"
            fullWidth={true}
            onClick={() => alert("출석체크 이동")}
          >
            출석 체크 시작하기
          </Button>
          <Button
            size="sm"
            variant="secondary"
            fullWidth={true}
            onClick={() => alert("모임비 추가 납부")}
          >
            모임비 추가 납부하기
          </Button>
        </Flex.RowBetweenCenter>
      </div>
    </div>
  );
}
