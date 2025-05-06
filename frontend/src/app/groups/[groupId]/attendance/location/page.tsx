"use client";

import { Flex } from "@/components/ui-components/layout/Flex";
import { Typography } from "@/components/ui-components/typography/Typography";
import Image from "next/image";

export default function LocationAttendancePage() {
  return (
    <>
      <Typography.Heading3>위치 출석체크</Typography.Heading3>

      <Flex.RowCenter className="gap-2">
        <Image
          src="/icons/developer.png"
          alt="개발 중인 똑디"
          width={130}
          height={200}
        />
        <div className="relative bg-[#E5EFFE] rounded-xl p-4 max-w-xs text-sm shadow-md">
          <div
            className="absolute -left-2 top-4 w-0 h-0 
          border-t-8 border-b-8 border-r-8
          border-t-transparent border-b-transparent border-r-[#E5EFFE]"
          />
          <Typography.BodySmall className="text-[#5B5B5B]">
            <span className="font-bold text-[#7BABFF]">위치 출석체크</span>{" "}
            기능은
            <br />
            지금 열심히 <span className="font-bold text-[#7BABFF]">개발 중</span>입니다!
            <br />
            조금만 기다려주세요! ( ੭ ･ᴗ･ )੭
          </Typography.BodySmall>
        </div>
      </Flex.RowCenter>
    </>
  );
}
