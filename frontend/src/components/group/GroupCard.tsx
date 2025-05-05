// src/components/group/GroupCard.tsx

import { GroupType } from "@/types/group";
import { Typography } from "@/components/ui-components/typography/Typography";
import { Flex } from "@/components/ui-components/layout/Flex";

interface GroupCardProps {
  group: GroupType;
}

export default function GroupCard({ group }: GroupCardProps) {
  const {
    name,
    category = "현재 모임",
    image_url,
    group_balance = 0,
    locked_amount = 0,
  } = group;
  const displayImage = image_url || "/group-images/default.png";

  return (
    <div className="w-full">
      {/* 상단: 이미지 + 그룹명 + 카테고리 + 추가 확인 */}
      <Flex.RowBetweenCenter className="w-full">
        <Flex.RowStartCenter className="gap-3">
          <img
            src={displayImage}
            alt={`${name} 대표 이미지`}
            className="w-10 h-10 object-contain"
          />
          <div>
            <Flex.RowStartCenter className="gap-2">
              <Typography.BodyLarge className="font-bold">
                {name}
              </Typography.BodyLarge>
              <span className="text-xs text-white bg-emerald-400 rounded-full px-2 py-0.5">
                {category}
              </span>
            </Flex.RowStartCenter>
            <Typography.BodyLarge className="font-bold">
              {group_balance.toLocaleString()}원
            </Typography.BodyLarge>
          </div>
        </Flex.RowStartCenter>
        <button className="text-xs px-2 py-0.5 border border-gray-300 rounded-full text-gray-500">
          락인 관리
        </button>
      </Flex.RowBetweenCenter>

      {/* 하단: 락인 금액 */}
      <Flex.RowBetweenCenter className="pt-2 border-t border-gray-200 w-full mt-2">
        <Typography.BodySmall className="text-gray-500">
          락인 금액
        </Typography.BodySmall>
        <Typography.BodySmall className="text-gray-500">
          {locked_amount.toLocaleString()}원
        </Typography.BodySmall>
      </Flex.RowBetweenCenter>
    </div>
  );
}
