// src/components/group/GroupCard.tsx

import { GroupType } from "@/types/group";
import { Typography } from "@/components/ui-components/typography/Typography";
import { Flex } from "@/components/ui-components/layout/Flex";

interface GroupCardProps {
  group: GroupType;
  badgeColor?: string;
  textColor?: string;
}

export default function GroupCard({
  group,
  badgeColor = "#34D399",
  textColor = "#22BD9C",
}: GroupCardProps) {
  const {
    name,
    category = "현재 모임",
    image_url,
    group_balance = 0,
    locked_amount = 0,
  } = group;

  const isDefaultImage = image_url === "/images/groups/default.png";

  const cleanUrl = image_url
    .replace(/\\/g, "/") // 역슬래시 → 슬래시
    .replace("/media", ""); // "/media"만 제거

  const displayImage = isDefaultImage
    ? image_url
    : `http://localhost:8000/files${cleanUrl}`;

  return (
    <div className={`w-full`}>
      {/* 상단: 이미지 + 그룹명 + 카테고리 + 추가 확인 */}
      <Flex.RowBetweenCenter className="w-full">
        <Flex.RowStartCenter className="gap-4">
          <img
            src={displayImage}
            alt={`${name} 대표 이미지`}
            className="w-20 h-20 object-contain"
          />
          <div>
            <Flex.RowStartCenter className="gap-2">
              <Typography.BodyLarge className="font-bold">
                {name}
              </Typography.BodyLarge>
              <span
                className="text-xs text-white font-bold rounded-full px-2 py-0.5"
                style={{ backgroundColor: badgeColor, color: textColor }}
              >
                {category}
              </span>
            </Flex.RowStartCenter>
            <Typography.BodyLarge className="font-bold">
              {Math.round(group_balance).toLocaleString()}원
            </Typography.BodyLarge>
          </div>
        </Flex.RowStartCenter>
        {/* <button className="text-xs px-2 py-0.5 border border-gray-300 rounded-full text-gray-500">
          락인 관리
        </button> */}
      </Flex.RowBetweenCenter>

      {/* 하단: 락인 금액 */}
      <Flex.RowBetweenCenter className="pt-2 border-t border-gray-200 w-full mt-2">
        <Typography.BodySmall className="text-gray-500">
          락인 금액
        </Typography.BodySmall>
        <Typography.BodySmall className="text-gray-500">
          {Math.round(locked_amount).toLocaleString()}원
        </Typography.BodySmall>
      </Flex.RowBetweenCenter>
    </div>
  );
}
