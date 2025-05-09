"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui-components/ui/Button";
import { Flex } from "@/components/ui-components/layout/Flex";
import { Typography } from "@/components/ui-components/typography/Typography";
import { useAttendance } from "@/hooks/Attendance/useAttendance";
import { useAttendanceStore } from "@/stores/useAttendanceStore";

export default function PhotoAttendancePage() {
  const router = useRouter();
  const { groupId } = useParams<{ groupId: string }>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { usePhotoAttendance } = useAttendance();
  const { set } = useAttendanceStore();
  const { mutate: submitPhotoAttendance, isPending } = usePhotoAttendance();

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = () => {
    if (!selectedFile || !groupId) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    submitPhotoAttendance(
      { formData, groupId: Number(groupId) },
      {
        onSuccess: (data) => {
          set({
            groupId: Number(groupId),
            type: "photo",
            attendees: data.attendees,
            userIds: data.user_ids,
            availableToSpend: data.available_to_spend,
            imageUrl: data.image_url,
          });
          router.push(`/groups/${groupId}/attendance/photo/confirm`);
          console.error("출석 성공", data);
        },
        onError: (error) => {
          console.error("출석 실패", error);
        },
      }
    );
  };

  return (
    <div className="relative min-h-screen pb-[96px]">
      <Typography.Heading3 className="text-center pt-6">
        사진 출석체크
      </Typography.Heading3>

      <Flex.ColCenter className="mt-10 px-4">
        {!selectedFile ? (
          <>
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
          </>
        ) : (
          <>
            <img
              src={previewUrl ?? undefined}
              alt="업로드한 사진"
              className="w-full rounded-lg shadow-md"
            />
          </>
        )}
      </Flex.ColCenter>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-sm px-2 py-4 bg-white">
        <Flex.ColCenter className="gap-3">
          <Button variant="secondary" onClick={openFilePicker}>
            {selectedFile ? "다시 선택하기" : "사진 선택하기"}
          </Button>

          {selectedFile && (
            <Button onClick={handleSubmit} disabled={isPending}>
              {isPending ? "출석 진행 중..." : "출석체크 진행하기"}
            </Button>
          )}
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
    </div>
  );
}
