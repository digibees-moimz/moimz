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
  const totalAvailableToSpend = Math.floor(availableToSpend * count);

  return (
    <div className="p-5 mt-6 bg-[#EEFAF7] rounded-xl space-y-1 text-sm text-gray-800">
      <Typography.Body className="font-bold text-[#22BD9C]">
        출석한 인원 - {count}명
      </Typography.Body>

      <div className="flex flex-col">
        <span className=" pt-2 font-bold p-1">1인당 결제 가능 금액</span>
        <div className="flex justify-between p-1 pl-2">
          <span>락인 기준</span>
          <span className="text-[#22BD9C] text-base">
            {Math.round(minAmount).toLocaleString()} 원
          </span>
        </div>

        <div className="flex justify-between p-1 pl-2">
          <span>후불 결제 포함</span>
          <span className="text-[#22BD9C] text-base">
            {Math.round(minAmount + 100000).toLocaleString()} 원
          </span>
        </div>
      </div>

      <div className="flex flex-col border-t border-gray-200 mt-3">
        <span className=" pt-2 font-bold p-1">총 결제 가능 금액</span>
        <div className="flex justify-between p-1 pl-2">
          <span>락인 기준</span>
          <span className="text-[#22BD9C] text-base">
            {Math.round(totalAvailableToSpend).toLocaleString()} 원
          </span>
        </div>

        <div className="flex justify-between p-1 pl-2">
          <span>후불 결제 포함</span>
          <span className="text-[#22BD9C] text-base">
            {Math.round(
              totalAvailableToSpend + 100000 * count
            ).toLocaleString()}{" "}
            원
          </span>
        </div>
      </div>
    </div>
  );
};
