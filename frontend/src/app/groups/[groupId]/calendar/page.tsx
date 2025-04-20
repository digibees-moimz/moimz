import Link from "next/link";

interface Props {
  params: { groupId: string };
}

export default function CalendarPage({ params: { groupId } }: Props) {
  const monthLabel = "2025년 5월";
  // 1일부터 31일까지 배열 생성
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="p-4 space-y-4 border rounded-lg max-w-md mx-auto">
      {/* 월 선택 헤더 */}
      <div className="flex justify-between items-center text-lg font-semibold">
        <button>{"<"}</button>
        <span>{monthLabel}</span>
        <button>{">"}</button>
      </div>

      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 text-center text-sm text-gray-500">
        {["일", "월", "화", "수", "목", "금", "토"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      {/* 날짜 & 링크 */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => (
          <Link
            key={day}
            href={`/groups/${groupId}/calendar/${day}`}
            className="flex flex-col items-center hover:bg-gray-100 rounded"
          >
            <div className="w-8 h-8 flex items-center justify-center rounded-full">
              {day}
            </div>
            {/* 더미 결제 내역(예시) */}
            <span className="text-xs text-blue-500">+50,000</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
