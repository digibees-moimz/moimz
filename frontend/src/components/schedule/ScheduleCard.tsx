import Image from "next/image";
import { FaRegClock, FaMapMarkerAlt } from "react-icons/fa";
import { AiOutlineSchedule } from "react-icons/ai";
import { Typography } from "../ui-components/typography/Typography";
import { Button } from "../ui-components/ui/Button";
import { Flex } from "../ui-components/layout/Flex";

type ScheduleCardProps = {
  type: "today" | "next";
  groupName?: string;
  scheduleTitle: string;
  time: string;
  location?: string;
  dday?: string;
};

export const ScheduleCard = ({
  type,
  groupName,
  scheduleTitle,
  time,
  location,
  dday,
}: ScheduleCardProps) => {
  const isToday = type === "today";
  const icon = isToday ? "hanging_woodi" : "hanging_ddockdi";
  const translateY = isToday ? "-translate-y-1/5" : "-translate-y-1/7 ";
  const backgroundColor = isToday ? "bg-[#EEFAF7]" : "bg-[#FFF3F6]";
  const buttonColor = isToday ? "secondary" : "destructive";
  const disableAttendance = dday !== undefined && dday !== "D-day";

  return (
    <div className="relative max-w-xl mx-auto">
      {/* 상단 타이틀 */}
      <Typography.Heading3 className="mb-2 ml-2 font-bold">
        {isToday ? "오늘의 모임" : "다음 모임은?"}
      </Typography.Heading3>

      {/* 캐릭터 */}
      <div
        className={`absolute left-1/2 -translate-x-1/1 z-10 top-0 ${translateY}`}
      >
        <Image src={`/icons/${icon}.png`} alt={icon} width={65} height={65} />
      </div>

      {/* 카드 본체 */}
      <div className={`${backgroundColor} rounded-xl p-3 relative z-0`}>
        <Flex.RowBetweenCenter className="px-3 pb-2">
          {/* 모임명 또는 제목 */}
          <Flex.RowStartCenter>
            {isToday && <Typography.Heading4>{groupName}</Typography.Heading4>}
            {!isToday && (
              <Typography.Heading4>{scheduleTitle}</Typography.Heading4>
            )}
            {!isToday && dday !== undefined && (
              <Typography.BodySmall className="text-[#FC9DB3] font-bold pl-3">
                {dday}
              </Typography.BodySmall>
            )}
          </Flex.RowStartCenter>

          {/* 시간 + D-day */}
          <Flex.RowEndCenter className="gap-3">
            {isToday ? (
              <Flex.RowCenter className="flex items-center gap-1">
                <AiOutlineSchedule className="text-gray-400" size={18} />
                <Typography.BodySmall className="text-gray-400">
                  {scheduleTitle}
                </Typography.BodySmall>
              </Flex.RowCenter>
            ) : (
              location && (
                <Flex.RowCenter className="flex items-center gap-1">
                  <FaMapMarkerAlt className="text-gray-400" />
                  <Typography.BodySmall className="text-gray-400">
                    {location}
                  </Typography.BodySmall>
                </Flex.RowCenter>
              )
            )}
            {/* 시간 */}
            <Flex.RowEndCenter className="flex items-center gap-1">
              <FaRegClock className="text-gray-400" />
              <Typography.BodySmall className="text-gray-400">
                {time}
              </Typography.BodySmall>
            </Flex.RowEndCenter>
          </Flex.RowEndCenter>
        </Flex.RowBetweenCenter>

        {/* 버튼 영역 */}
        <div className="flex gap-2">
          <Button
            size="xs"
            variant={buttonColor}
            isDisabled={disableAttendance}
          >
            출석체크 시작하기
          </Button>
          <Button size="xs">모임비 추가 납부하기</Button>
        </div>
      </div>
    </div>
  );
};
