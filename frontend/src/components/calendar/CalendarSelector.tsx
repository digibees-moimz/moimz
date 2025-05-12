// src/components/calendar/CalendarSelector.tsx
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
} from "date-fns";
import CalendarGrid from "./CalendarGrid";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

interface CalendarSelectorProps {
  initialDate?: Date;
  onSelectDate: (date: Date) => void;
}

export default function CalendarSelector({
  initialDate = startOfToday(),
  onSelectDate,
}: CalendarSelectorProps) {
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [currentMonth, setCurrentMonth] = useState(
    format(initialDate, "yyyy년 MM월")
  );

  const firstDayCurrentMonth = parse(currentMonth, "yyyy년 MM월", new Date());
  const days = eachDayOfInterval({
    start: firstDayCurrentMonth,
    end: endOfMonth(firstDayCurrentMonth),
  });

  const previousMonth = () => {
    const prev = add(firstDayCurrentMonth, { months: -1 });
    setCurrentMonth(format(prev, "yyyy년 MM월"));
  };

  const nextMonth = () => {
    const next = add(firstDayCurrentMonth, { months: 1 });
    setCurrentMonth(format(next, "yyyy년 MM월"));
  };

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
    onSelectDate(date);
  };

  const getDayClass = (day: Date): string => {
    const isSunday = getDay(day) === 0;
    const isSaturday = getDay(day) === 6;
    const isSelected = isSameDay(day, selectedDate);

    return [
      isToday(day) && "font-bold",
      isSelected && "border-2 border-[#22BD9C]",
      isSunday && "text-rose-400",
      isSaturday && "text-blue-400",
      "mx-auto flex h-8 w-8 items-center justify-center rounded-full cursor-pointer",
    ]
      .filter(Boolean)
      .join(" ");
  };

  return (
    <div className="w-full max-w-md p-4 bg-white rounded-xl">
      {/* 월 네비게이션 */}
      <div className="flex justify-between items-center mb-4">
        <button onClick={previousMonth} className="hover:text-[#22BD9C]">
          <FaChevronLeft />
        </button>
        <h2 className="text-lg font-medium">
          {format(firstDayCurrentMonth, "yyyy년 MM월")}
        </h2>
        <button onClick={nextMonth} className="hover:text-[#22BD9C]">
          <FaChevronRight />
        </button>
      </div>

      {/* 요일 */}
      <div className="grid grid-cols-7 text-sm font-medium text-center text-gray-500 border-b pb-2 mb-2">
        {["일", "월", "화", "수", "목", "금", "토"].map((day, i) => (
          <div
            key={i}
            className={
              i === 0 ? "text-rose-400" : i === 6 ? "text-blue-400" : ""
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
        isLoading={false}
        onSelect={handleSelectDate}
        isDateHasEvent={() => false} // 이벤트 없음 처리
        getDayClass={getDayClass}
      />
    </div>
  );
}
