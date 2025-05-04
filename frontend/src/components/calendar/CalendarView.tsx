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
  isSameDay,
  parse,
  startOfToday,
  parseISO,
} from "date-fns";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { useMonthlySchedules } from "@/hooks/useMonthlySchedules";
import type { ScheduleItem } from "@/types/schedule";
import EventList from "./EventList"; // 새로 만들 컴포넌트
import CalendarGrid from "./CalendarGrid";

export default function CalendarView({ groupId }: { groupId: number }) {
  const today = startOfToday();
  const [currentMonth, setCurrentMonth] = useState(
    format(today, "yyyy년 MM월")
  );
  const [selectedDate, setSelectedDate] = useState<Date>(today);

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

  // 날짜별 일정 매핑
  const eventsByDate = new Map<string, ScheduleItem[]>();
  schedules.forEach((s) => {
    const key = format(parseISO(s.date), "yyyy-MM-dd");
    if (!eventsByDate.has(key)) {
      eventsByDate.set(key, []);
    }
    eventsByDate.get(key)!.push(s);
  });

  // 시작 날짜와 종료 날짜 사이의 모든 날짜를 포함하는 배열을 생성
  const days = eachDayOfInterval({
    start: firstDayCurrentMonth, // 달력에서 표시할 월의 첫 날
    end: endOfMonth(firstDayCurrentMonth), // 주어진 날짜가 속한 월의 마지막 날
  });

  // 요일별 클래스 관리
  // const colStartClasses = [
  //   "",
  //   "col-start-2",
  //   "col-start-3",
  //   "col-start-4",
  //   "col-start-5",
  //   "col-start-6",
  //   "col-start-7",
  // ];

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
    setSelectedDate(day);
  };

  const isDateHasEvent = (day: Date): boolean => {
    const key = format(day, "yyyy-MM-dd");
    return eventsByDate.has(key) && eventsByDate.get(key)!.length > 0;
  };

  const getDayClass = (day: Date): string => {
    const hasEvent = isDateHasEvent(day);
    const isSunday = getDay(day) === 0;
    const isSaturday = getDay(day) === 6;
    const isSelected = isSameDay(day, selectedDate);

    return [
      isToday(day) && "font-bold", // 오늘 날짜는 볼드 처리
      isSelected && "border-2 border-[#22BD9C]", // 선택된 날짜는 테두리 추가
      hasEvent && "bg-[#E3F7F4] cursor-pointer", // 이벤트 있는 날짜는 연한 민트색 배경과 커서 포인터
      isSunday && "text-rose-400", // 일요일은 빨간색
      isSaturday && "text-blue-400", // 토요일은 파란색
      !isSunday && !isSaturday && !isToday(day) && !hasEvent && "text-gray-400", // 일반 날짜 중 이벤트가 없는 경우만 회색 처리
      "mx-auto flex h-8 w-8 items-center justify-center rounded-full",
    ]
      .filter(Boolean)
      .join(" ");
  };

  // 선택된 날짜의 일정 목록 가져오기
  const getSelectedDateEvents = (): ScheduleItem[] => {
    const key = format(selectedDate, "yyyy-MM-dd");
    return eventsByDate.get(key) || [];
  };

  return (
    <div className="max-w-md mx-auto relative">
      {/* 캘린더 부분 */}
      <div className="p-4">
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
                index === 0
                  ? "text-rose-400"
                  : index === 6
                  ? "text-blue-400"
                  : ""
              }
            >
              {day}
            </div>
          ))}
        </div>

        {/* 날짜 */}
        <CalendarGrid
          days={days}
          selectedDate={selectedDate}
          isLoading={isLoading}
          onSelect={handleSelectDate}
          isDateHasEvent={isDateHasEvent}
          getDayClass={getDayClass}
        />

        {/* 선택된 날짜의 일정 목록 */}
        <div className="mt-4 border-t pt-4">
          <EventList
            events={getSelectedDateEvents()}
            date={selectedDate}
            groupId={groupId}
          />
        </div>
      </div>
    </div> // ✅ 추가
  );
}
