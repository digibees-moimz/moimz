import { PendingSchedule } from "@/types/schedule";
import { useScheduleAction } from "@/hooks/schedule/useScheduleAction";
import Image from "next/image";
import { FaMapMarkerAlt } from "react-icons/fa";
import { AiOutlineSchedule } from "react-icons/ai";
import { Typography } from "../ui-components/typography/Typography";
import { Button } from "../ui-components/ui/Button";
import { Flex } from "../ui-components/layout/Flex";
import { formatKoreanDateCustom } from "@/utils/formatDate";

interface ScheduleEndBtnProps {
  schedule: PendingSchedule;
  groupId: number;
  userId: number;
}

export const ScheduleEndBtn = ({
  schedule,
  groupId,
  userId,
}: ScheduleEndBtnProps) => {
  const { handleEndSchedule, isPending } = useScheduleAction();

  return (
    <div className="relative max-w-xl mx-auto">
      {/* 상단 타이틀 */}
      <Typography.Heading4 className="mb-2 text-[#333]">
        <span className="text-[#FC9DB3]">종료되지 않은 일정</span>이 있어요!
      </Typography.Heading4>

      {/* 캐릭터 */}
      <div className={`absolute translate-x-70 z-10 top-0 -translate-y-1/7`}>
        <Image
          src={`/icons/hanging_ddockdi.png`}
          alt="똑디 아이콘"
          width={65}
          height={65}
        />
      </div>

      {/* 카드 본체 */}
      <div className={`bg-[#FFF3F6] rounded-xl p-3 relative z-0`}>
        <div className="p-1">
          <Typography.Heading5 className="mb-1 text-[#222]">
            {schedule.title}
          </Typography.Heading5>

          {/* 날짜 + 장소 */}
          <Flex.RowBetweenCenter className="p-1 mb-2 text-sm text-gray-400">
            <Flex.RowStartCenter className="gap-1">
              <AiOutlineSchedule size={18} />
              {formatKoreanDateCustom(schedule.date, {
                year: true,
                month: true,
                day: true,
                hour: true,
                minute: true,
              })}
            </Flex.RowStartCenter>

            <Flex.RowEndCenter className="gap-1">
              <FaMapMarkerAlt size={16} />
              {schedule.location ?? "미정"}
            </Flex.RowEndCenter>
          </Flex.RowBetweenCenter>

          {/* 버튼 영역 */}
          <Button
            size="sm"
            variant="destructive"
            isDisabled={isPending}
            onClick={() =>
              handleEndSchedule({
                scheduleId: schedule.id,
                groupId,
                userId,
              })
            }
          >
            모임 일정 종료
          </Button>
        </div>
      </div>
    </div>
  );
};
