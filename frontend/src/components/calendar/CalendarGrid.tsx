// src/components/calendar/CalendarGrid.tsx
import { Grid } from "@/components/ui-components/layout/Grid";
import { Flex } from "@/components/ui-components/layout/Flex";
import { Typography } from "@/components/ui-components/typography/Typography";
import type { ScheduleItem } from "@/types/schedule";

interface Props {
  groupId: number;
  year: number;
  month: number;
  schedules: ScheduleItem[];
}

export default function CalendarGrid({
  groupId,
  year,
  month,
  schedules,
}: Props) {
  // 1) 해당 달의 일 수
  const daysInMonth = new Date(year, month, 0).getDate();
  // 2) 1일의 요일 인덱스 (0=일,1=월,...6=토)
  const firstWeekday = new Date(year, month - 1, 1).getDay();
  // 3) 빈 칸 채우기
  const blanks = Array.from({ length: firstWeekday }, () => null);
  // 4) 날짜 배열
  const dates = [
    ...blanks,
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  // 빠른 조회용 맵 (여러 이벤트가 있다면 array로 바꾸면 됩니다)
  const evMap = new Map<number, ScheduleItem>();
  schedules.forEach((s) => {
    const d = new Date(s.date).getDate();
    evMap.set(d, s);
  });

  return (
    <>
      {/* 요일 헤더 */}
      <Grid.Col7 className="text-center text-sm text-gray-500 mb-2">
        {["일", "월", "화", "수", "목", "금", "토"].map((wd) => (
          <Typography.BodySmall key={wd}>{wd}</Typography.BodySmall>
        ))}
      </Grid.Col7>

      {/* 날짜 그리드 */}
      <Grid.Col7 className="gap-y-4 gap-x-2">
        {dates.map((day, idx) => {
          if (day === null) {
            // 지난달/다음달 빈칸
            return <div key={idx} />;
          }

          const ev = evMap.get(day);
          const isDone = ev?.is_done;
          // 사용자 예시처럼 색상을 event마다 달리하고 싶으면 조건 추가
          const circleBg = ev
            ? isDone
              ? "bg-gray-200 text-gray-600"
              : "bg-blue-100 text-blue-600"
            : "";

          return (
            <Flex.ColStartCenter key={idx} className="p-1">
              {/* 1) 날짜 원 */}
              <Flex.RowCenter className={`w-8 h-8 rounded-full ${circleBg}`}>
                <Typography.BodySmall>{day}</Typography.BodySmall>
              </Flex.RowCenter>

              {/* 2) 이벤트 텍스트 */}
              {ev && (
                <Typography.Caption className="mt-1 text-xs text-blue-500">
                  {ev.title}
                </Typography.Caption>
              )}
            </Flex.ColStartCenter>
          );
        })}
      </Grid.Col7>
    </>
  );
}
