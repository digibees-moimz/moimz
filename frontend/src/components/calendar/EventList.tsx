// src/components/calendar/EventList.tsx

"use client";

import { format } from "date-fns";
import Link from "next/link";
import { FaClock } from "react-icons/fa";
import { FaCalendarAlt, FaRegClock, FaMapMarkerAlt } from "react-icons/fa";
import type { ScheduleItem } from "@/types/schedule";
import { Button } from "../ui-components/ui/Button";
import { useRouter } from "next/navigation";
import { formatKoreanDateCustom } from "@/utils/formatDate";
import { Typography } from "../ui-components/typography/Typography";
import { Flex } from "../ui-components/layout/Flex";

type EventListProps = {
  events: ScheduleItem[];
  date: Date;
  groupId: number;
};

export default function EventList({ events, date, groupId }: EventListProps) {
  const formattedDate = format(date, "yyyy년 MM월 dd일");
  const router = useRouter();

  console.log(events);

  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <Typography.Heading5 className="flex items-center text-gray-600">
          <FaCalendarAlt className="mr-2 text-[#22BD9C]" size={20} />
          {formattedDate} 일정
        </Typography.Heading5>
        <Button
          variant="secondary"
          size="xs"
          fullWidth={false}
          onClick={() => router.push(`/groups/${groupId}/calendar/create`)}
        >
          일정 추가
        </Button>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-6 text-gray-500">일정이 없습니다.</div>
      ) : (
        <ul className="space-y-3">
          {events.map((event) => (
            <li
              key={event.id}
              className="bg-white rounded-lg shadow-sm border border-gray-100"
            >
              <Link
                href={`/groups/${groupId}/calendar/${event.id}`}
                className="block p-4 hover:bg-gray-50 transition-colors rounded-lg"
              >
                <Typography.Heading5 className="font-medium text-[#22BD9C] mb-2">
                  {event.title}
                </Typography.Heading5>
                <Flex.RowBetweenCenter>
                  <div className="flex items-center gap-1 mb-1">
                    <FaRegClock className="text-gray-400" />
                    <Typography.BodySmall className="text-gray-400">
                      {formatKoreanDateCustom(event.date, {
                        hour: true,
                        minute: true,
                      })}
                    </Typography.BodySmall>
                  </div>

                  <div className="flex items-center gap-1 mb-1">
                    <FaMapMarkerAlt className="text-gray-400" />
                    <Typography.BodySmall className="text-gray-400">
                      {event.location || "장소 미정"}
                    </Typography.BodySmall>
                  </div>
                </Flex.RowBetweenCenter>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
