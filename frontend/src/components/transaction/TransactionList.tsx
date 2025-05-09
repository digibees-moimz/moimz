// src/components/transaction/TransactionList.tsx
"use client";

import { Flex } from "@/components/ui-components/layout/Flex";
import { Typography } from "@/components/ui-components/typography/Typography";
import { TransactionParticipant, TransactionRead } from "@/types/transaction";

interface TransactionListProps {
  transactions: TransactionRead[];
}

export default function TransactionList({
  transactions,
}: TransactionListProps) {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="w-full text-center text-gray-400 py-4">
        거래 내역이 없습니다.
      </div>
    );
  }

  return (
    <div className="w-full mt-8 space-y-4">
      {transactions.map((tx) => {
        const total = tx.total_amount;
        const participants = tx.participants ?? [];
        const perPerson =
          participants.length > 0
            ? Math.round((total / participants.length) * 100) / 100
            : 0;

        return (
          <div
            key={tx.id}
            className="w-full border border-violet-300 rounded-xl px-4 py-3 shadow-sm"
          >
            {/* 상단: 상호명 + 일시 */}
            <Flex.RowBetweenCenter>
              <Typography.Heading4 className="text-base font-semibold">
                {tx.store_name || "이름 없는 장소"}
              </Typography.Heading4>
              <Typography.Caption className="text-gray-400">
                {new Date(tx.created_at).toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Typography.Caption>
            </Flex.RowBetweenCenter>

            {/* 참여자 아바타 */}
            <Flex.RowStartCenter className="mt-2 gap-2">
              {participants.map((p: TransactionParticipant) => (
                <img
                  key={p.user_id}
                  //   src={`/images/avatar-${p.user_id % 5}.png`}
                  src={`/images/default-avatar.png`}
                  alt="avatar"
                  className="w-8 h-8 rounded-full"
                />
              ))}
            </Flex.RowStartCenter>

            {/* 금액 정보 */}
            <div className="mt-2 space-y-1">
              <Typography.BodySmall>
                총 지출: {total.toLocaleString()}원
              </Typography.BodySmall>
              <Typography.BodySmall>
                1인당 지출: {perPerson.toLocaleString()}원
              </Typography.BodySmall>
            </div>
          </div>
        );
      })}
    </div>
  );
}
