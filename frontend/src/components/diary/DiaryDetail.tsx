// src/components/diary/DiaryDetail.tsx
"use client";

import { useState } from "react";
import type { Diary } from "@/types/diary";
import { Flex } from "@/components/ui-components/layout/Flex";
import { Typography } from "@/components/ui-components/typography/Typography";
import Image from "next/image";
import { Button } from "../ui-components/ui/Button";

interface DiaryDetailProps {
  diary: Diary;
}

export default function DiaryDetail({ diary }: DiaryDetailProps) {
  const [showFull, setShowFull] = useState(false);

  // Format date
  const date = new Date(diary.created_at);
  const day = ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];

  // Format hashtags for display if needed
  const hashtagArray = (diary.hashtags as string | undefined)?.split(" ") ?? [];

  // Generate mood rating (5 dots, some filled based on mood)

  return (
    <div>
      {/* Header */}
      <div className="flex items-center pb-8">
        <Typography.Heading3>모임 일기</Typography.Heading3>
      </div>

      <div className="w-full relative bg-[#FFF3F6] rounded-lg mb-4">
        {/* 노트 스프링 */}
        <div className="relative w-full h-11 z-10 -translate-y-1/2">
          <Image
            src="/icons/spring.png"
            alt="노트 스프링"
            fill
            sizes="100vw"
            className="object-contain"
            priority
          />
        </div>

        {/* 일기 */}
        <div className="px-6 pb-5">
          {/* 일기 제목 */}
          <Typography.Heading4 className="text-center mb-3">
            {diary.title}
          </Typography.Heading4>

          <div className="flex justify-between items-start">
            {/* 날짜 + 참석자 */}
            <div className="space-y-1">
              {/* 날짜 */}
              <Typography.BodySmall className="font-mono text-gray-600">
                {date.getFullYear()}년 {date.getMonth() + 1}월 {date.getDate()}
                일 {day}요일
              </Typography.BodySmall>

              {/* 참석자 */}
              <Flex.RowStartCenter className="gap-2">
                <Typography.BodySmall className="text-gray-600">
                  참석한 사람:
                </Typography.BodySmall>
                <div className="flex -space-x-2">
                  {diary.attendees.map((attendee) => (
                    <div
                      key={attendee.user_id}
                      className="w-6 h-6 rounded-full bg-gray-200 border border-white flex items-center justify-center overflow-hidden"
                    >
                      {attendee.profile_image_url ? (
                        <img
                          src={attendee.profile_image_url}
                          alt={attendee.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-xs">
                          {attendee.name.charAt(0)}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </Flex.RowStartCenter>
            </div>

            {/* 우측 상단 이미지 */}
            <Image
              src="/icons/dandi.png"
              alt="단디"
              width={60}
              height={60}
              className="ml-4"
            />
          </div>

          {/* 일기 그림 */}
          <div className="my-2 rounded-sm overflow-hidden">
            <img
              // src={diary.image_path || "/images/default-diary.png"}
              src={"/images/groups/default.png"}
              alt="diary image"
              className="w-full h-auto object-cover"
            />
          </div>

          {/* 토글 버튼 */}
          <div className="flex justify-end items-center my-4">
            <Typography.Caption className="text-gray-600 mr-2">
              전체 일기 보기
            </Typography.Caption>
            <div
              className={`w-12 h-6 rounded-full ${
                showFull ? "bg-[#C2EDE4]" : "bg-gray-200"
              } relative cursor-pointer`}
              onClick={() => setShowFull(!showFull)}
            >
              <div
                className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-all duration-300 ${
                  showFull ? "right-0.5" : "left-0.5"
                }`}
              />
            </div>
          </div>

          {/* 일기 본문 */}
          <Typography.Body className="text-gray-800 mb-4 leading-relaxed whitespace-pre-line">
            {showFull ? diary.diary_text : diary.summary}
          </Typography.Body>

          {/* 해시태그 */}
          {diary.hashtags && (
            <Typography.Body className="text-[#7BABFF] mb-4 font-semibold">
              {hashtagArray.map((tag: string, index: number) => (
                <span key={index} className="mr-1">
                  {tag}
                </span>
              ))}
            </Typography.Body>
          )}
        </div>
      </div>

      {/* 버튼 */}
      <div className="grid grid-cols-2 gap-3 w-full">
        <Button size="sm" variant="secondary">
          모임 일기 공유하기
        </Button>
        <Button size="sm">모임일 앨범 보기</Button>
      </div>
    </div>
  );
}
