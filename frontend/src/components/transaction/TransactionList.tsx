// src/components/transaction/TransactionList.tsx
"use client";

import { useState } from "react";
import { Flex } from "@/components/ui-components/layout/Flex";
import { Typography } from "@/components/ui-components/typography/Typography";
import { TransactionParticipant, TransactionRead } from "@/types/transaction";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

interface TransactionListProps {
  transactions: TransactionRead[];
}

export default function TransactionList({
  transactions,
}: TransactionListProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!transactions || transactions.length === 0) {
    return (
      <div className="w-full text-center text-gray-400 py-4">
        아직 결제 내역이 없어요
      </div>
    );
  }

  return (
    <div className="w-full mt-8">
      {/* 토글 버튼 */}
      <div className="flex justify-end mb-1">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 text-[#7BABFF] font-bold text-sm"
        >
          {isOpen ? "결제 내역 숨기기" : "결제 내역 보기"}
          {isOpen ? <FaChevronUp /> : <FaChevronDown />}
        </button>
      </div>

      {/* 거래내역 리스트 */}
      {isOpen && (
        <>
          <div className="bg-[#EAF9FF] rounded-lg p-2 my-3">
            <p className="px-2 text-[#7BABFF] font-semibold text-sm">
              총{" "}
              <span className="font-bold ">
                {transactions.length}건의 결제 내역
              </span>
              이 있어요
            </p>
          </div>

          <div className="space-y-4">
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
                  className="w-full bg-white border border-gray-300 rounded-sm px-4 py-2 font-mono text-xs text-gray-800"
                >
                  {/* 상단: 상호명 + 일시 */}
                  <Flex.RowBetweenCenter>
                    <span className="font-semibold text-sm">
                      {tx.store_name || "이름 없는 장소"}
                    </span>
                    <span className="text-gray-400">
                      {new Date(tx.created_at).toLocaleDateString("ko-KR", {
                        year: "2-digit",
                        month: "2-digit",
                        day: "2-digit",
                      })}
                    </span>
                  </Flex.RowBetweenCenter>

                  {/* 참여자 */}
                  <div className="mt-1 flex flex-wrap gap-1">
                    {participants.map((p: TransactionParticipant) => (
                      <img
                        key={p.user_id}
                        // src={
                        //   p.profile_image_url ?? "/images/default-avatar.png"
                        // }
                        src={"/images/default-avatar.png"}
                        alt="avatar"
                        className="w-6 h-6 rounded-full border"
                      />
                    ))}
                  </div>

                  {/* 금액 정보 */}
                  <div className="mt-2 border-t border-dashed border-gray-300 pt-2">
                    <Flex.RowBetweenCenter>
                      <span>총 금액</span>
                      <span>{total.toLocaleString()}원</span>
                    </Flex.RowBetweenCenter>
                    <Flex.RowBetweenCenter>
                      <span>1인당</span>
                      <span>{perPerson.toLocaleString()}원</span>
                    </Flex.RowBetweenCenter>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="bg-gray-100 h-[15px] mt-5" />
        </>
      )}
    </div>
  );
}
