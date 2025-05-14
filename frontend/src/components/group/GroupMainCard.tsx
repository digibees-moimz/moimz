import { useState } from "react";
import { GroupType } from "@/types/group";
import { Typography } from "@/components/ui-components/typography/Typography";
import { Flex } from "@/components/ui-components/layout/Flex";
import { Button } from "@/components/ui-components/ui/Button";
import Link from "next/link";
import { useUserStore } from "@/stores/userStore";
import { useGroups } from "@/hooks/useGroups";
import { PiCrownSimpleFill } from "react-icons/pi";
import Image from "next/image";

interface GroupMainCardProps {
  group: GroupType;
  backgroundColor: string;
  badgeColor: string;
  textColor: string;
}

export default function GroupMainCard({
  group,
  backgroundColor,
  badgeColor,
  textColor,
}: GroupMainCardProps) {
  const {
    id,
    name,
    category = "기본 모임",
    image_url = "/character/default.png",
    group_balance = 0,
    locked_amount = 0,
    member_count = 1,
    account_number,
  } = group;

  const { userId } = useUserStore(); // 🔥 userId 가져오기
  const [modalOpen, setModalOpen] = useState(false);
  const { data: groups } = useGroups(userId); // 🔥 전체 그룹 정보

  const isDefaultImage = image_url === "/images/groups/default.png";
  const cleanUrl = image_url
    .replace(/\\/g, "/") // 역슬래시 → 슬래시
    .replace("/media", ""); // "/media"만 제거
  const displayImage = isDefaultImage
    ? image_url
    : `http://localhost:8000/files${cleanUrl}`;

  return (
    <>
      <div
        className="w-full p-6 text-gray-700"
        style={{ backgroundColor: backgroundColor }}
      >
        <Flex.RowBetweenCenter className="gap-3">
          <Flex.ColStartCenter className="items-start gap-1 w-auto h-auto">
            {/* 멤버 수 */}
            <div className="flex gap-1 bg-white px-2 py-0.5 rounded-full mb-2">
              <PiCrownSimpleFill color="#F2BB44" />
              <span className="text-xs text-gray-700">{member_count}명</span>
            </div>

            {/* 제목 + 카테고리 */}
            <Flex.RowStartCenter className="gap-2 mb-0">
              <Typography.Heading3>{name}</Typography.Heading3>
              <div
                className="text-xs px-2 py-0.5 rounded-full font-black"
                style={{ backgroundColor: badgeColor, color: textColor }}
              >
                {category}
              </div>
            </Flex.RowStartCenter>

            {/* 모임통장 계좌번호 */}
            <Typography.Body className="text-gray-500">
              {account_number}
            </Typography.Body>

            <div className="mt-5">
              <Typography.Heading2>
                {Math.round(group_balance).toLocaleString()}원
              </Typography.Heading2>

              <Typography.BodySmall className="text-gray-500 pt-1">
                내 락인 금액 |{" "}
                <span className="font-bold">
                  {Math.round(locked_amount).toLocaleString()}원
                </span>
              </Typography.BodySmall>
            </div>
          </Flex.ColStartCenter>

          {/* 캐릭터 */}
          <img
            src={displayImage}
            alt="캐릭터"
            width={100}
            height={100}
            className="w-[50%] object-contain"
          />
        </Flex.RowBetweenCenter>

        {/* 버튼 */}
        <Flex.RowStartCenter className="w-full gap-3 mt-5">
          <Link href={`/groups/${id}/lockin`} className="flex-grow">
            <Button
              variant="white"
              className="text-sm w-full"
              fullWidth={false}
            >
              락인 관리
            </Button>
          </Link>
          <Link href={`/groups/${id}/account`} className="flex-grow">
            <Button
              variant="white"
              fullWidth={false}
              className="text-sm w-full"
            >
              모임비 현황
            </Button>
          </Link>

          <Link href={`/groups/${id}/account`} className="flex-grow">
            <Button
              variant="white"
              fullWidth={false}
              className="text-sm w-full"
            >
              결제 내역
            </Button>
          </Link>
        </Flex.RowStartCenter>
      </div>
    </>
  );
}
