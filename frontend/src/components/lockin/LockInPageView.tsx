// src/components/lockin/LockInPageView.tsx
"use client";

import { useState } from "react";
import { GroupType } from "@/types/group";
import { Flex } from "@/components/ui-components/layout/Flex";
import { Typography } from "@/components/ui-components/typography/Typography";
import { Button } from "@/components/ui-components/ui/Button";
import { useGroupColorStore } from "@/stores/useGroupColorStore";
import { groupColorMap } from "@/constants/groupColorMap";

export interface LockInPageViewProps {
  group: GroupType;
  currentLockedAmount: number;
  onLockIn: (amount: number) => void;
  onLockOut: (amount: number) => void;
}

export default function LockInPageView({
  group,
  currentLockedAmount,
  onLockIn,
  onLockOut,
}: LockInPageViewProps) {
  const [amount, setAmount] = useState<string>("");

  // 문자열 → 숫자 변환 (빈문자열이나 NaN일 경우 확실히 0으로 처리)
  const numericAmount = isNaN(Number(amount)) ? 0 : Number(amount);

  /** ─────────────────────────────────────────────────────
   *  색상, 이미지 URL 처리 (기존 GroupMainCard 로직 그대로)
   * ──────────────────────────────────────────────────── */
  const { groupColorMap: userGroupColorMap } = useGroupColorStore();
  const colorIndex = userGroupColorMap[group.id] ?? 0;
  const palette = groupColorMap[colorIndex % groupColorMap.length];

  const isDefaultImage = group.image_url === "/images/groups/default.png";
  const cleanUrl = group.image_url.replace(/\\/g, "/").replace("/media", "");
  const displayImage = isDefaultImage
    ? group.image_url
    : `http://localhost:8000/files${cleanUrl}`;

  return (
    <div className="flex flex-col w-full min-h-dvh bg-gray-100">
      {/* 헤더 카드 */}
      <div
        className="w-full p-4 sm:p-6 text-gray-700"
        style={{ backgroundColor: palette.bg }}
      >
        <Flex.RowBetweenCenter className="mb-3">
          <div
            className="text-xs px-2 py-0.5 rounded-full font-black"
            style={{ backgroundColor: palette.badge, color: palette.text }}
          >
            {group.category || "기본 모임"}
          </div>
        </Flex.RowBetweenCenter>

        <div className="flex flex-row justify-between items-center gap-4">
          <div className="flex flex-col items-start gap-1">
            <Typography.Heading3 className="w-full text-left">
              {group.name}
            </Typography.Heading3>
            <Typography.Body className="text-gray-600 w-full text-left">
              {group.account_number}
            </Typography.Body>

            <div className="mt-4 w-full text-left">
              <Typography.Heading2>
                {(group.group_balance ?? 0).toLocaleString()}원
              </Typography.Heading2>
              <Typography.BodySmall className="text-gray-500 pt-1">
                내 락인 금액&nbsp;|&nbsp;
                <span className="font-bold">
                  {currentLockedAmount.toLocaleString()}원
                </span>
              </Typography.BodySmall>
            </div>
          </div>

          <img
            src={displayImage}
            alt="캐릭터"
            className="w-36 shrink-0 object-contain"
          />
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="flex-1 p-4 sm:p-6 flex flex-col gap-4 sm:gap-6">
        {/* 금액 입력 */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm w-full">
          <Typography.Heading3 className="mb-3 text-left">
            금액 입력
          </Typography.Heading3>

          <div className="relative">
            <input
              type="number"
              min={0}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="w-full border-b border-gray-300 py-2 text-xl sm:text-2xl font-bold text-right pr-12 focus:outline-none focus:border-b-2"
            />
            <span className="absolute right-0 bottom-2 text-lg sm:text-xl font-bold text-gray-700">
              원
            </span>
          </div>

          <Typography.BodySmall className="text-gray-500 mt-2 text-right">
            최대 락인 해제 가능 금액:&nbsp;
            {currentLockedAmount.toLocaleString()}원
          </Typography.BodySmall>
        </div>

        {/* 액션 버튼 */}
        <div className="flex flex-row gap-3 w-full">
          <Button
            className="w-full py-3"
            isDisabled={!(numericAmount > 0)}
            onClick={() => onLockIn(numericAmount)}
          >
            추가 락인
          </Button>

          <Button
            variant="white"
            className="w-full py-3 border border-gray-300"
            isDisabled={
              !(numericAmount > 0 && numericAmount <= currentLockedAmount)
            }
            onClick={() => onLockOut(numericAmount)}
          >
            락인 해제
          </Button>
        </div>
      </div>
    </div>
  );
}
