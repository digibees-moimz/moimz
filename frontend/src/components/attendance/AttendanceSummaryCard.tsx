// src/components/attendance/AttendanceSummaryCard.tsx
import { Typography } from "@/components/ui-components/typography/Typography";

export const AttendanceSummaryCard = ({
  attendees,
  count,
  availableToSpend,
}: {
  attendees: any[];
  count: number;
  availableToSpend: number;
}) => {
  const minAmount = Math.min(...attendees.map((p) => p.locked_amount));
  const totalAmount = availableToSpend * count;

  return (
    <div className="p-5 mt-6 bg-[#EEFAF7] rounded-xl space-y-1 text-sm text-gray-800">
      <Typography.Body className="font-bold text-[#22BD9C]">
        출석한 인원 - {count}명
      </Typography.Body>

      <div className="flex justify-between p-1">
        <span>출석자 중 최소 금액</span>
        <span>{minAmount.toLocaleString()} 원</span>
      </div>

      <div className="flex justify-between p-1">
        <span>1인당 결제 가능 금액</span>
        <span>{availableToSpend.toLocaleString()} 원</span>
      </div>

      <div className="flex justify-between border-t mt-3 pt-2 border-gray-200 font-bold p-1">
        <span>총 결제 가능 금액</span>
        <span className="text-[#22BD9C] text-base">
          {totalAmount.toLocaleString()} 원
        </span>
      </div>
    </div>
  );
};
