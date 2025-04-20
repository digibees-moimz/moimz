// src/app/groups/[groupId]/calendar/[date]/page.tsx
import type { Metadata } from "next";

interface Props {
  params: { groupId: string; date: string };
}

export const metadata: Metadata = {
  title: "일별 일정 상세",
};

interface Event {
  id: number;
  title: string;
  attendees: string[]; // avatar URLs 또는 이모지
  total: number;
}

export default function CalendarDetailPage({ params }: Props) {
  const { groupId, date } = params;

  // 예시 데이터
  const events: Event[] = [
    {
      id: 1,
      title: "홍대 BBQ",
      attendees: ["🦜", "🐵", "🐶", "🐱"],
      total: 160000,
    },
    {
      id: 2,
      title: "강남 스타벅스",
      attendees: ["🦜", "🐵", "🐶"],
      total: 40000,
    },
    {
      id: 3,
      title: "홍대 CGV",
      attendees: ["🦜", "🐵", "🐶", "🐱"],
      total: 60000,
    },
    {
      id: 4,
      title: "유지 스시",
      attendees: ["🦜", "🐵", "🐶", "🐥"],
      total: 60000,
    },
    {
      id: 5,
      title: "광화문 교보문고",
      attendees: ["🦜", "🐵"],
      total: 42000,
    },
  ];

  return (
    <div className="p-4 max-w-md mx-auto space-y-4">
      <h1 className="text-2xl font-bold">
        그룹 {groupId} • {date}일 일정 상세
      </h1>
      {events.map((e) => (
        <div key={e.id} className="border rounded-lg p-4 space-y-1">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold">{e.title}</h2>
            <button className="text-sm text-gray-500">일기장 보기</button>
          </div>
          <div className="flex items-center gap-1">
            참석한 사람:
            {e.attendees.map((a, idx) => (
              <span key={idx} className="text-xl">
                {a}
              </span>
            ))}
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>총 지출: {e.total.toLocaleString()}원</span>
            <span>
              1인당: {(e.total / e.attendees.length).toLocaleString()}원
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
