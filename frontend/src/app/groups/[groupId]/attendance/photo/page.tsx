"use client";

import { Flex } from "@/components/ui-components/layout/Flex";
import { Typography } from "@/components/ui-components/typography/Typography";
import { Button } from "@/components/ui-components/ui/Button";
import Image from "next/image";

export default function PhotoAttendancePage() {
  return (
    <>
      <Typography.Heading3>사진 출석체크</Typography.Heading3>
      <Flex.ColBetweenCenter className="h-180">
        <div>
          <Image
            src="/icons/take_a_picture.png"
            alt="지도 아이콘"
            width={300}
            height={200}
          />
          <Typography.Body className="text-center pt-5">
            얼굴을 인식해 자동으로 출석을 처리해요.
            <br />
            처음 이용 시
            <span className="font-semibold text-[#22BD9C]"> 얼굴 등록</span>이
            필요해요!
          </Typography.Body>
        </div>

        <Button variant="secondary" className="text-xl">
          사진 출석체크 시작하기
        </Button>
      </Flex.ColBetweenCenter>
    </>
  );
}
