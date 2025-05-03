// src/components/calendar/CalendarHeader.tsx
import { Flex } from "@/components/ui-components/layout/Flex";
import { Typography } from "@/components/ui-components/typography/Typography";

interface Props {
  year: number;
  month: number;
  onPrev: () => void;
  onNext: () => void;
}

export default function CalendarHeader({ year, month, onPrev, onNext }: Props) {
  return (
    <Flex.RowBetweenCenter className="px-2">
      <button onClick={onPrev} aria-label="이전 달">{`<`}</button>
      <Typography.Heading3>{`${year}년 ${month}월`}</Typography.Heading3>
      <button onClick={onNext} aria-label="다음 달">{`>`}</button>
    </Flex.RowBetweenCenter>
  );
}
