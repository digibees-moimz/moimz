"use client";

import { useState } from "react";
import { useTodaySchedules } from "@/hooks/schedule/useUpcomingSchedule";
import { useParams } from "next/navigation";
import { ScheduleModal } from "@/components/attendance/ScheduleModal";
import { Typography } from "@/components/ui-components/typography/Typography";
import { Flex } from "@/components/ui-components/layout/Flex";
import { formatKoreanDateCustom } from "@/utils/formatDate";
import { FaRegClock, FaMapMarkerAlt } from "react-icons/fa";
import Image from "next/image";

interface ScheduleSelectorProps {
  selectedScheduleId: number | null;
  onSelect: (id: number) => void;
}

export function ScheduleSelector({
  selectedScheduleId,
  onSelect,
}: ScheduleSelectorProps) {
  const { groupId } = useParams();
  const { data: schedules = [], isFetching } = useTodaySchedules(
    Number(groupId)
  );
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      {isFetching ? (
        <div className="bg-gray-50 w-full h-[85px] p-4 rounded-lg" />
      ) : schedules && schedules.length > 0 ? (
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#F4FBCF] w-full p-4 rounded-lg hover:bg-[#EEF6C2] cursor-pointer"
        >
          <Flex.RowStartCenter className="gap-6">
            <Image
              src="/icons/calendar.png"
              alt="달력 아이콘"
              width={70}
              height={70}
            />
            <Flex.ColStartStart>
              {selectedScheduleId ? (
                  <>
                    <div className="bg-[#EEFAF7] p-4 w-full rounded-xl text-gray-700 font-mono">
                      {/* 일정 제목 - 왼쪽 정렬 */}
                      <Typography.BodySmall className="font-semibold text-base text-left">
                        {
                          schedules.find((s) => s.id === selectedScheduleId)
                            ?.title
                        }
                      </Typography.BodySmall>

                      {/* 시간 및 장소 - 가로 정렬 */}
                      <div className="flex flex-row items-center justify-start gap-x-6 text-sm pl-1">
                        <div className="flex items-center gap-2">
                          <FaRegClock className="text-gray-500" />
                          <span className="text-gray-500">
                            {formatKoreanDateCustom(
                              schedules.find(
                                (s) => s.id === selectedScheduleId
                              )!.date,
                              { hour: true }
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaMapMarkerAlt className="text-gray-500" />
                          <span>
                            {schedules.find((s) => s.id === selectedScheduleId)
                              ?.location || "장소 미정"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <Typography.Heading5 className="mt-4">
                      일정이 선택되었어요!
                    </Typography.Heading5>
                    <Typography.Caption>
                      일정이 잘못되었다면 다시 선택해주세요
                    </Typography.Caption>
                  </>
                  
              ) : (
                <>
                  <Typography.Heading5 className="pb-1">
                    오늘 등록된 일정이 있어요!
                  </Typography.Heading5>
                  <Typography.Caption>
                    일정을 선택해 출석에 연결해보세요.
                  </Typography.Caption>
                  <Typography.Caption as="p">
                    선택하지 않으면 번개 모임으로 처리됩니다.
                  </Typography.Caption>
                </>
              )}
            </Flex.ColStartStart>
          </Flex.RowStartCenter>
        </button>
      ) : (
        <div className="bg-[#FFFDEA] w-full p-4 rounded-lg">
          <Flex.RowStartCenter className="gap-6">
            <Image
              src="/icons/lightning.png"
              alt="번개 아이콘"
              width={70}
              height={70}
            />
            <Flex.ColStartStart>
              <Typography.Heading5 className="pb-1">
                번개 모임이시군요!
              </Typography.Heading5>
              <Typography.Caption>오늘 등록된 일정이 없어요</Typography.Caption>
              <Typography.Caption as="p">
                갑작스러운 만남이 더 즐거운 법이죠
              </Typography.Caption>
            </Flex.ColStartStart>
          </Flex.RowStartCenter>
        </div>
      )}

      <ScheduleModal
        open={showModal}
        onClose={() => setShowModal(false)}
        schedules={schedules ?? []}
        selectedId={selectedScheduleId}
        onSelect={onSelect}
      />
    </>
  );
}
