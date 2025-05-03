// src/components/calendar/CalendarView.tsx
"use client";

import { useState } from "react";
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isToday,
  parse,
  startOfToday,
  isBefore,
  parseISO,
} from "date-fns";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { useMonthlySchedules } from "@/hooks/useMonthlySchedules";
import type { ScheduleItem } from "@/types/schedule";

export default function CalendarView({ groupId }: { groupId: number }) {
  const today = startOfToday();
  const [currentMonth, setCurrentMonth] = useState(
    format(today, "yyyy년 MM월")
  );

  // 실제 날짜 연산을 수행할 때 필요한 Date 객체 생성
  const firstDayCurrentMonth = parse(currentMonth, "yyyy년 MM월", today);
  const year = firstDayCurrentMonth.getFullYear();
  const month = firstDayCurrentMonth.getMonth() + 1;

  // 스케줄 데이터 가져오기
  const { data: schedules = [], isLoading } = useMonthlySchedules(
    groupId,
    year,
    month
  );

  const eventMap = new Map<string, ScheduleItem>();
  schedules.forEach((s) => {
    const key = format(parseISO(s.date), "yyyy-MM-dd");
    eventMap.set(key, s);
  });

  // 시작 날짜와 종료 날짜 사이의 모든 날짜를 포함하는 배열을 생성
  const days = eachDayOfInterval({
    start: firstDayCurrentMonth, // 달력에서 표시할 월의 첫 날
    end: endOfMonth(firstDayCurrentMonth), // 주어진 날짜가 속한 월의 마지막 날
  });

  // 요일별 클래스 관리
  const colStartClasses = [
    "",
    "col-start-2",
    "col-start-3",
    "col-start-4",
    "col-start-5",
    "col-start-6",
    "col-start-7",
  ];

  const previousMonth = () => {
    const firstDayPrevMonth = add(firstDayCurrentMonth, { months: -1 });
    setCurrentMonth(format(firstDayPrevMonth, "yyyy년 MM월"));
  };

  const nextMonth = () => {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
    setCurrentMonth(format(firstDayNextMonth, "yyyy년 MM월"));
  };

  // 날짜 선택 함수
  const handleSelectDate = (day: Date) => {
    // 오늘 날짜 이전을 선택하려는 경우 return
    if (isBefore(day, today)) return;

    // 선택한 날짜로 이동
    window.location.href = `/groups/${groupId}/calendar/${day.getDate()}`;
  };

  const isDateHasEvent = (day: Date): boolean => {
    const key = format(day, "yyyy-MM-dd");
    return eventMap.has(key);
  };

  const getDayClass = (day: Date): string => {
    const isBeforeToday = isBefore(day, today);
    const hasEvent = isDateHasEvent(day);

    return [
      isToday(day) && "text-[#22BD9C] font-bold",
      isBeforeToday && "text-gray-400", // 오늘 날짜 이전은 회색으로 표시
      hasEvent && "bg-[#E3F7F4] text-[#22BD9C]", // 이벤트 있는 날짜는 연한 민트색 배경에 민트색 텍스트
      getDay(day) === 0 && !isBeforeToday && !hasEvent && "text-rose-400", // 일요일
      getDay(day) === 6 && !isBeforeToday && !hasEvent && "text-blue-400",
      "mx-auto flex h-8 w-8 items-center justify-center rounded-full",
    ]
      .filter(Boolean)
      .join(" ");
  };

  // 일정 제목 표시 함수
  const getEventTitle = (day: Date): string | null => {
    const key = format(day, "yyyy-MM-dd");
    const event = eventMap.get(key);
    if (event) {
      return event.title.length > 6
        ? event.title.slice(0, 6) + "…"
        : event.title;
    }
    return null;
  };

  return (
    <div className="max-w-md mx-auto p-4 relative">
      {/* 연도 + 월 + 버튼 */}
      <div className="flex justify-between items-center mb-4">
        <button
          type="button"
          onClick={previousMonth}
          className="p-2 hover:text-[#22BD9C] transition-colors"
          disabled={isLoading}
        >
          <span className="sr-only">이전달</span>
          <FaChevronLeft size={16} aria-hidden="true" />
        </button>
        <h2 className="text-lg font-medium">
          {format(firstDayCurrentMonth, "yyyy년 MM월")}
        </h2>
        <button
          type="button"
          onClick={nextMonth}
          className="p-2 hover:text-[#22BD9C] transition-colors"
          disabled={isLoading}
        >
          <span className="sr-only">다음달</span>
          <FaChevronRight size={16} aria-hidden="true" />
        </button>
      </div>

      {/* 요일 */}
      <div className="grid grid-cols-7 text-sm font-medium text-center text-gray-500 border-b pb-2 mb-2">
        {["일", "월", "화", "수", "목", "금", "토"].map((day, index) => (
          <div
            key={index}
            className={
              index === 0 ? "text-rose-400" : index === 6 ? "text-blue-400" : ""
            }
          >
            {day}
          </div>
        ))}
      </div>

      {/* 날짜 */}
      <div className="relative min-h-[280px]">
        {/* 로딩 오버레이 */}
        {isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10">
            <div className="flex flex-col items-center">
              <div className="flex space-x-1">
                <div
                  className="w-2 h-2 bg-[#22BD9C] rounded-full animate-bounce"
                  style={{ animationDelay: "0s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-[#22BD9C] rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-[#22BD9C] rounded-full animate-bounce"
                  style={{ animationDelay: "0.4s" }}
                ></div>
              </div>
              <span className="text-sm text-[#22BD9C] mt-2">로딩 중...</span>
            </div>
          </div>
        )}

        <ul className="grid grid-cols-7 gap-1 text-sm">
          {days.map((day, dayIdx) => (
            <li
              key={day.toString()}
              className={`${
                dayIdx === 0 && colStartClasses[getDay(day)]
              } relative py-1`}
            >
              <button
                type="button"
                onClick={() => handleSelectDate(day)}
                className={getDayClass(day)}
                disabled={isLoading}
              >
                <time dateTime={format(day, "yyyy-MM-dd")}>
                  {format(day, "d")}
                </time>
              </button>

              {/* 일정 제목 표시 */}
              {getEventTitle(day) && (
                <div className="text-xs text-[#22BD9C] mt-1 text-center">
                  {getEventTitle(day)}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
