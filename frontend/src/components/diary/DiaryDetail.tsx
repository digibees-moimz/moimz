// src/components/diary/DiaryDetail.tsx
"use client";

import { useState } from "react";
import type { Diary } from "@/types/diary";
import { Flex } from "@/components/ui-components/layout/Flex";
import { Typography } from "@/components/ui-components/typography/Typography";

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
    <div className="w-full max-w-md mx-auto pb-6 px-4">
      {/* Header */}
      <Typography.Heading1 className="text-lg font-bold py-4">
        모임일기
      </Typography.Heading1>

      {/* Notebook style container */}
      <div className="w-full bg-pink-50 rounded-lg overflow-hidden mb-4">
        {/* Spiral binding effect at top */}
        <div className="w-full flex justify-between px-1 py-1 bg-white">
          {Array(20)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="w-1.5 h-6 bg-gradient-to-b from-pink-300 to-pink-200 rounded-full"
              ></div>
            ))}
        </div>

        <div className="p-4">
          {/* Title with character icon */}
          <div className="flex items-center mb-3">
            <img
              src="/images/character-icon.png"
              alt="캐릭터"
              className="w-12 h-12 mr-2"
            />
            <Typography.Heading2 className="text-lg font-bold">
              {diary.title}
            </Typography.Heading2>
          </div>

          {/* Date and weather */}
          <div className="flex justify-between items-center mb-3">
            <Typography.BodySmall className="text-black font-medium">
              {date.getFullYear()}년 {date.getMonth() + 1}월 {date.getDate()}일{" "}
              {day}요일
            </Typography.BodySmall>
            <Typography.BodySmall className="text-black font-medium">
              날씨: 맑음 ☀️
            </Typography.BodySmall>
          </div>

          {/* Attendees */}
          <Flex.RowStartCenter className="gap-2 mb-2 mt-4">
            <Typography.BodySmall className="text-black font-medium">
              참석한 사람
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
                    <span className="text-xs">{attendee.name.charAt(0)}</span>
                  )}
                </div>
              ))}
            </div>
          </Flex.RowStartCenter>
          {/* Diary image */}
          <div className="mb-4 rounded-lg overflow-hidden">
            <img
              src={diary.image_path || "/images/default-diary.png"}
              alt="diary image"
              className="w-full h-auto object-cover"
            />
          </div>

          {/* Toggle for full/summary view */}
          <div className="flex justify-end items-center mb-4">
            <Typography.BodySmall className="text-gray-600 mr-2">
              전체 일기 보기
            </Typography.BodySmall>
            <div
              className={`w-12 h-6 rounded-full ${
                showFull ? "bg-teal-400" : "bg-gray-200"
              } relative cursor-pointer`}
              onClick={() => setShowFull(!showFull)}
            >
              <div
                className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-all duration-300 ${
                  showFull ? "right-0.5" : "left-0.5"
                }`}
              ></div>
            </div>
          </div>

          {/* Diary content */}
          <Typography.BodyLarge className="text-black mb-4 leading-relaxed">
            {showFull ? diary.diary_text : diary.summary}
          </Typography.BodyLarge>

          {/* Hashtags */}
          {diary.hashtags && (
            <Typography.BodySmall className="text-blue-500 mb-4">
              {hashtagArray.map((tag: string, index: number) => (
                <span key={index} className="mr-1">
                  {tag}
                </span>
              ))}
            </Typography.BodySmall>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-3 w-full">
        <button className="bg-teal-400 text-white py-3 rounded-lg font-medium text-sm">
          모임 일기 공유하기
        </button>
        <button className="bg-blue-400 text-white py-3 rounded-lg font-medium text-sm">
          모임일 공유 앨범 보기
        </button>
      </div>
    </div>
  );
}
