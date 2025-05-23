// src/components/calendar/CalendarGrid.tsx
import { getDay, format } from "date-fns";
import { LoadingBar } from "@/components/ui-components/shared/LoadingBar";

interface CalendarGridProps {
  days: Date[];
  selectedDate: Date;
  isLoading: boolean;
  onSelect: (day: Date) => void;
  isDateHasEvent: (day: Date) => boolean;
  getDayClass: (day: Date) => string;
}

const colStartClasses = [
  "",
  "col-start-2",
  "col-start-3",
  "col-start-4",
  "col-start-5",
  "col-start-6",
  "col-start-7",
];

export default function CalendarGrid({
  days,
  isLoading,
  onSelect,
  isDateHasEvent,
  getDayClass,
}: CalendarGridProps) {
  return (
    <div className="relative min-h-[250px]">
      {isLoading && <LoadingBar />}

      <ul className="grid grid-cols-7 gap-1 text-sm">
        {days.map((day, idx) => (
          <li
            key={day.toString()}
            className={`${
              idx === 0 && colStartClasses[getDay(day)]
            } relative py-1`}
          >
            <button
              type="button"
              onClick={() => onSelect(day)}
              className={getDayClass(day)}
              disabled={isLoading}
            >
              <time dateTime={format(day, "yyyy-MM-dd")}>
                {format(day, "d")}
              </time>
            </button>
            {isDateHasEvent(day) && (
              <div className="flex justify-center mt-1">
                <div className="w-1 h-1 bg-[#22BD9C] rounded-full"></div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
