import { useEffect, useRef, useState } from "react";
import CalendarSelector from "./CalendarSelector";
import { Button } from "../ui-components/ui/Button";

interface Props {
  onClose: () => void;
  onSelect: (date: Date) => void;
}

export default function CalendarSelectorModal({ onClose, onSelect }: Props) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // 바깥 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
      <div ref={modalRef} className="bg-white rounded-2xl w-[80%] p-5">
        <CalendarSelector onSelectDate={(date) => setSelectedDate(date)} />

        <Button
          variant="secondary"
          isDisabled={!selectedDate}
          onClick={() => {
            if (selectedDate) {
              onSelect(selectedDate);
              onClose();
            }
          }}
        >
          확인
        </Button>
      </div>
    </div>
  );
}
