import { useEffect, useRef } from "react";
import CalendarSelector from "./CalendarSelector";

interface Props {
  onClose: () => void;
  onSelect: (date: Date) => void;
}

export default function CalendarSelectorModal({ onClose, onSelect }: Props) {
  const modalRef = useRef<HTMLDivElement>(null);

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
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
      <div ref={modalRef} className="bg-white rounded-xl shadow-lg p-4">
        <CalendarSelector
          onSelectDate={(date) => {
            onSelect(date);
            onClose();
          }}
        />
      </div>
    </div>
  );
}
