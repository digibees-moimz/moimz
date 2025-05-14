"use client";

import { Typography } from "@/components/ui-components/typography/Typography";
import { Button } from "@/components/ui-components/ui/Button";
import Image from "next/image";
import Link from "next/link";

export default function MyPage() {
  return (
    <>
      <Typography.Heading3>마이페이지</Typography.Heading3>

      {/* 얼굴 등록 */}
      <div className="w-full">
        <Typography.Heading5 className="text-gray-600">
          얼굴 등록
        </Typography.Heading5>
        <Typography.BodySmall className="text-gray-600">
          얼굴 등록을 하면 사진으로 간편하게 출석체크를 할 수 있어요!
        </Typography.BodySmall>
        <div className="mx-auto relative w-[150px] h-[150px] mt-4 overflow-hidden">
          {/* 이미지 */}
          <Image
            src="/icons/dandi_face2.png"
            alt="단디 얼굴"
            fill
            className="object-contain z-0"
          />
        </div>
        <Link href="/my/face-register">
          <Button size="sm">얼굴 등록하기</Button>
        </Link>
      </div>
    </>
  );
}
