"use client";

import { useState } from "react";
import { Flex } from "@/components/ui-components/layout/Flex";
import { Typography } from "@/components/ui-components/typography/Typography";
import { Button } from "@/components/ui-components/ui/Button";
import { PhotoSelectModal } from "@/components/attendance/PhotoSelectModal";
import Image from "next/image";

export default function PhotoAttendancePage() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="relative min-h-screen pb-28 px-4 pt-8">
      <Typography.Heading3 className="text-center">
        사진 출석체크
      </Typography.Heading3>

      <Flex.ColCenter className="mt-10">
        <Image
          src="/icons/take_a_picture.png"
          alt="사진 찍기"
          width={300}
          height={200}
        />
        <Typography.Body className="text-center pt-5">
          얼굴을 인식해 자동으로 출석을 처리해요.
          <br />
          처음 이용 시{" "}
          <span className="font-semibold text-[#22BD9C]">얼굴 등록</span>이
          필요해요!
        </Typography.Body>
      </Flex.ColCenter>

      {/* 하단 고정 버튼 */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-sm px-4">
        <Button
          variant="secondary"
          className="w-full text-lg"
          onClick={() => setShowModal(true)}
        >
          사진 출석체크 시작하기
        </Button>
      </div>

      {/* 모달 */}
      {showModal && <PhotoSelectModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
