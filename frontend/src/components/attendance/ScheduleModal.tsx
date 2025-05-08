"use client";

import { ScheduleCardItem } from "@/types/schedule";
import { Typography } from "@/components/ui-components/typography/Typography";
import { FaRegClock, FaMapMarkerAlt } from "react-icons/fa";
import { Flex } from "../ui-components/layout/Flex";
import { formatKoreanDateCustom } from "@/utils/formatDate";
import { Button } from "../ui-components/ui/Button";

interface ScheduleModalProps {
  open: boolean;
  onClose: () => void;
  schedules: ScheduleCardItem[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}

export function ScheduleModal({
  open,
  onClose,
  schedules,
  selectedId,
  onSelect,
}: ScheduleModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 h-screen flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4 animate-fade-in">
        {/* 헤더 */}
        <div className="flex justify-between items-center border-b pb-3">
          <Typography.Heading4>오늘 일정 선택</Typography.Heading4>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl font-bold"
          >
            &times;
          </button>
        </div>

        {/* 일정 목록 */}
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          {schedules.map((schedule) => {
            const isSelected = selectedId === schedule.id;
            return (
              <button
                key={schedule.id}
                onClick={() => {
                  onSelect(schedule.id);
                }}
                className={`w-full text-left px-4 py-3 rounded-xl border transition-all flex flex-col gap-1
                  ${
                    isSelected
                      ? "border-blue-500 bg-blue-50 shadow"
                      : "border-gray-200 bg-white hover:bg-gray-50"
                  }`}
              >
                <Flex.RowBetweenCenter>
                  <Typography.Body className="font-semibold text-gray-900">
                    {schedule.title}
                  </Typography.Body>
                  {isSelected && (
                    <p className="text-blue-600 text-xs font-medium mt-1 text-right">
                      ✓ 선택됨
                    </p>
                  )}
                </Flex.RowBetweenCenter>

                <Flex.RowStartCenter className="gap-12 text-sm text-gray-500 mt-1">
                  {/* 시간 */}
                  <Flex.RowStartCenter className="gap-1">
                    <FaRegClock className="text-gray-400" />
                    <span>
                      {formatKoreanDateCustom(schedule.date, {
                        hour: true,
                        minute: true,
                      })}
                    </span>
                  </Flex.RowStartCenter>

                  {/* 위치 */}
                  <Flex.RowStartCenter className="gap-1">
                    <FaMapMarkerAlt className="text-gray-400" />
                    <span>{schedule.location || "장소 미정"}</span>
                  </Flex.RowStartCenter>
                </Flex.RowStartCenter>
              </button>
            );
          })}
        </div>
        {/* 하단 버튼 */}
        <div className="pt-4 flex justify-end">
          <Button onClick={onClose}>선택 완료</Button>
        </div>
      </div>
    </div>
  );
}
