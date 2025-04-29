import { Flex } from "@/components/ui-components/layout/Flex";
import { Grid } from "@/components/ui-components/layout/Grid";
import Link from "next/link";

interface Props {
  params: { groupId: string };
}

export default function CalendarPage({ params: { groupId } }: Props) {
  const monthLabel = "2025년 5월";
  // 1일부터 31일까지 배열 생성
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="w-full p-4 space-y-4 border rounded-lg max-w-md mx-auto">
      {/* 월 선택 헤더 */}
      <Flex.RowCenter className="text-lg font-semibold gap-8">
        <button>{"<"}</button>
        <span>{monthLabel}</span>
        <button>{">"}</button>
      </Flex.RowCenter>

      {/* 요일 헤더 */}
      <Grid.Col7 className="text-center text-sm text-gray-500 gap-1">
        {["일", "월", "화", "수", "목", "금", "토"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </Grid.Col7>

      {/* 날짜 & 링크 */}
      <Grid.Col7 className="gap-1">
        {days.map((day) => (
          <Link key={day} href={`/groups/${groupId}/calendar/${day}`} passHref>
            <Flex.ColCenter className="hover:bg-gray-100 rounded p-1">
              <div className="w-8 h-8 flex items-center justify-center rounded-full">
                {day}
              </div>
              <span className="text-xs text-blue-500">+50,000</span>
            </Flex.ColCenter>
          </Link>
        ))}
      </Grid.Col7>
    </div>
  );
}
