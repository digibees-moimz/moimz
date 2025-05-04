// src/components/calendar/TimePickerModal.tsx
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const HOUR_ITEMS = Array.from({ length: 12 }, (_, i) =>
  String(i + 1).padStart(2, "0")
);
const MINUTE_ITEMS = Array.from({ length: 60 }, (_, i) =>
  String(i).padStart(2, "0")
);
const MERIDIEM_ITEMS = ["오전", "오후"];

function LoopPicker({
  items,
  selected,
  onSelect,
}: {
  items: string[];
  selected: string;
  onSelect: (value: string) => void;
}) {
  const [index, setIndex] = useState(() =>
    items.findIndex((item) => item === selected)
  );

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const direction = e.deltaY > 0 ? 1 : -1;
    setIndex((prev) => (prev + direction + items.length) % items.length);
  };

  useEffect(() => {
    onSelect(items[index]);
  }, [index]);

  const getDisplayItems = () => {
    const total = items.length;
    return [-2, -1, 0, 1, 2].map((offset) => {
      const i = (index + offset + total) % total;
      return items[i];
    });
  };

  return (
    <div
      onWheel={handleWheel}
      className="relative h-40 flex flex-col justify-center items-center text-center border rounded overflow-hidden"
    >
      <div className="flex flex-col items-center">
        {getDisplayItems().map((item, i) => {
          const isActive = i === 2;
          return (
            <div
              key={item + i}
              className={`py-1 transition-opacity ${
                isActive ? "text-[#22BD9C] font-bold text-lg" : "text-gray-400"
              }`}
            >
              {item}
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface TimePickerModalProps {
  onClose: () => void;
  onSelect: (hour: number, minute: number) => void;
  initialHour?: number;
  initialMinute?: number;
}

export default function TimePickerModal({
  onClose,
  onSelect,
  initialHour = 12,
  initialMinute = 0,
}: TimePickerModalProps) {
  const [meridiem, setMeridiem] = useState(initialHour >= 12 ? "오후" : "오전");
  const [hour, setHour] = useState(() => {
    const h = initialHour % 12;
    return h === 0 ? 12 : h;
  });
  const [minute, setMinute] = useState(initialMinute);

  const handleSelect = () => {
    let h = hour % 12;
    if (meridiem === "오후") h += 12;
    if (h === 24) h = 12;
    onSelect(h, minute);
    onClose();
  };

  const modalRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return createPortal(
    <div className="fixed inset-0 bg-black/30 z-50 flex justify-center items-center">
      <div
        ref={modalRef}
        className="bg-white rounded-xl p-6 shadow-lg w-[300px]"
      >
        <h2 className="text-lg font-bold mb-4">시간 선택</h2>
        <div className="flex gap-2 justify-between mb-4">
          <div className="flex-1 ">
            <div className="text-sm font-medium mb-1 text-center">
              오전 / 오후
            </div>
            <ul className="h-40 overflow-y-scroll text-center border rounded">
              {MERIDIEM_ITEMS.map((m) => (
                <li
                  key={m}
                  className={`py-2 cursor-pointer ${
                    meridiem === m
                      ? "bg-[#22BD9C] text-white font-bold"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => setMeridiem(m)}
                >
                  {m}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium mb-1 text-center">시</div>
            <LoopPicker
              items={HOUR_ITEMS}
              selected={String(hour).padStart(2, "0")}
              onSelect={(val) => setHour(Number(val))}
            />
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium mb-1 text-center">분</div>
            <LoopPicker
              items={MINUTE_ITEMS}
              selected={String(minute).padStart(2, "0")}
              onSelect={(val) => setMinute(Number(val))}
            />
          </div>
        </div>
        <button
          onClick={handleSelect}
          className="w-full py-2 bg-[#22BD9C] text-white font-semibold rounded hover:bg-[#1aa88b] transition"
        >
          확인
        </button>
      </div>
    </div>,
    document.body
  );
}
