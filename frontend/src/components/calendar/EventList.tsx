// src/components/calendar/EventList.tsx

"use client";

import { format } from "date-fns";
import Link from "next/link";
import { FaCalendarAlt, FaClock } from "react-icons/fa";
import type { ScheduleItem } from "@/types/schedule";
import { Button } from "../ui-components/ui/Button";
import { useRouter } from "next/navigation";

type EventListProps = {
  events: ScheduleItem[];
  date: Date;
  groupId: number;
};

export default function EventList({ events, date, groupId }: EventListProps) {
  const formattedDate = format(date, "yyyy년 MM월 dd일");
  const router = useRouter();

  return (
    <div className="px-4 pb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-lg flex items-center">
          <FaCalendarAlt className="mr-2 text-[#22BD9C]" />
          {formattedDate} 일정
        </h3>
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
                <h4 className="font-medium text-[#22BD9C] mb-2">
                  {event.title}
                </h4>

                <div className="text-sm text-gray-600 flex items-center gap-1 mb-1">
                  <FaClock className="text-gray-400" size={12} />
                  <span>
                    {new Date(event.date)
                      .toLocaleTimeString("ko-KR", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })
                      .replace("오전", "AM")
                      .replace("오후", "PM")}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
