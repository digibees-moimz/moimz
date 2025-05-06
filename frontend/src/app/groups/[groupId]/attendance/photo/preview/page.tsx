"use client";

import { useRef } from "react";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui-components/ui/Button";
import { Flex } from "@/components/ui-components/layout/Flex";
import { Typography } from "@/components/ui-components/typography/Typography";

export default function PhotoPreviewPage() {
  const searchParams = useSearchParams();
  const imageUrl = searchParams.get("src"); // URL.createObjectURL(file)로 전달된 값
  const router = useRouter();
  const { groupId } = useParams<{ groupId: string }>();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      console.log("업로드할 파일:", file);
      router.push(
        `/groups/${groupId}/attendance/photo/preview?src=${encodeURIComponent(
          previewUrl
        )}`
      );
    }
  };

  const handleSubmit = () => {
    // 출석 체크 API 요청
  };

  return (
    <>
      <Typography.Heading3>사진 출석체크</Typography.Heading3>
      <Flex.ColBetweenCenter className="min-h-screen">
        <div className="rounded-lg overflow-hidden shadow-md max-w-sm mx-auto mb-6">
          {imageUrl && (
            <img
              src={imageUrl ?? undefined}
              alt="업로드한 사진"
              className="w-full rounded-lg"
            />
          )}
        </div>

        {/* 하단 고정 버튼 */}
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-sm px-4">
          <Flex.ColCenter className="gap-3">
            <Button variant="destructive" onClick={openFilePicker}>
              다시 선택하기
            </Button>
            <Button onClick={handleSubmit}>출석체크 진행하기</Button>
          </Flex.ColCenter>
        </div>

        {/* 숨겨진 input */}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
      </Flex.ColBetweenCenter>
    </>
  );
}
