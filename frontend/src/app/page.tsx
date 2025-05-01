// src/app/page.tsx

import { Flex } from "@/components/ui-components/layout/Flex";
import { Typography } from "@/components/ui-components/typography/Typography";
import Link from "next/link";

export default function HomePage() {
  const groupId = 1;
  return (
    <>
      <Typography.Heading3 className="m-2">내 모임통장</Typography.Heading3>
      <Flex.ColCenter>
        <div className="bg-[#EEFAF7] w-full p-4 rounded-xl">
          <Link href={`/groups/${groupId}`} className="w-full">
            <Typography.BodyLarge className="font-bold pb-1">
              그룹 {groupId} 모임통장
            </Typography.BodyLarge>
            <Flex.RowBetweenCenter className="pt-2 border-t border-gray-200">
              <Typography.BodySmall className="text-gray-500">
                락인 금액
              </Typography.BodySmall>
              <Typography.BodySmall className="text-gray-500">
                100,000원
              </Typography.BodySmall>
            </Flex.RowBetweenCenter>
          </Link>
        </div>
      </Flex.ColCenter>
    </>
  );
}
