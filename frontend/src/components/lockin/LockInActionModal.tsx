// src/components/lockin/LockInActionModal.tsx
"use client";

import { useState } from "react";
import { GroupType } from "@/types/group";
import { Flex } from "@/components/ui-components/layout/Flex";
import { Typography } from "@/components/ui-components/typography/Typography";

export interface LockInActionModalProps {
  group: GroupType;
  currentLockedAmount: number;
  onClose: () => void;
  onLockIn: (amount: number) => void;
  onLockOut: (amount: number) => void;
}

export default function LockInActionModal({
  group,
  currentLockedAmount,
  onClose,
  onLockIn,
  onLockOut,
}: LockInActionModalProps) {
  const [amount, setAmount] = useState<string>("");

  return (
    <Flex.RowCenter className="fixed inset-0 bg-black/50 z-50">
      <div className="bg-white rounded-xl p-6 w-80 shadow-lg">
        <Flex.RowStartCenter className="gap-2 mb-4">
          <img src={group.image_url} alt="캐릭터" className="w-10 h-10" />
          <div>
            <Typography.BodySmall className="font-bold">
              {group.name}
            </Typography.BodySmall>
            <Typography.Caption>
              현재 락인 : {currentLockedAmount.toLocaleString()} 원
            </Typography.Caption>
          </div>
        </Flex.RowStartCenter>

        {/* 금액 입력 */}
        <div className="mb-4">
          <label className="block text-sm text-gray-700 mb-1">금액 입력</label>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            placeholder="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border px-3 py-2 rounded-md"
          />
        </div>

        {/* 액션 버튼 */}
        <Flex.RowBetweenCenter className="gap-2">
          <button
            onClick={() => onLockIn(Number(amount))}
            disabled={Number(amount) <= 0}
            className="flex-1 bg-blue-500 text-white py-2 rounded-md disabled:opacity-40"
          >
            추가 락인
          </button>

          <button
            onClick={() => onLockOut(Number(amount))}
            disabled={
              Number(amount) <= 0 || Number(amount) > currentLockedAmount
            }
            className="flex-1 bg-gray-300 text-black py-2 rounded-md disabled:opacity-40"
          >
            락인 해제
          </button>
        </Flex.RowBetweenCenter>

        {/* 닫기 */}
        <button
          onClick={onClose}
          className="mt-4 text-sm text-gray-500 w-full hover:underline"
        >
          뒤로가기
        </button>
      </div>
    </Flex.RowCenter>
  );
}
