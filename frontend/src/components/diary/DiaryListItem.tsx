// src/components/diary/DiaryListItem.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import type { Diary } from "@/types/diary";
import { Typography } from "@/components/ui-components/typography/Typography";
import { Flex } from "@/components/ui-components/layout/Flex";

interface DiaryListItemProps {
  diary: Diary;
  groupId: number;
}

export default function DiaryListItem({ diary, groupId }: DiaryListItemProps) {
  // 날짜 포맷 (YYYY년 M월 D일 요일)
  const date = new Date(diary.created_at);
  const day = ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];
  const dateLabel = `${date.getFullYear()}년 ${
    date.getMonth() + 1
  }월 ${date.getDate()}일 ${day}요일`;

  return (
    <Link
      href={`/groups/${groupId}/diary/${diary.id}`}
      className="relative rounded-lg shadow-sm transition-colors group block mb-4"
    >
      <Flex.RowStartCenter className="relative bg-[#FFF3F6] group-hover:bg-[#FFE9EF] rounded-lg pl-6 pr-5 py-5 gap-4 overflow-visible">
        {/* 스프링 이미지 */}
        <div className="absolute inset-y-1 -left-2 w-4 z-10">
          <Image
            src="/icons/springCol.png"
            alt="세로 스프링"
            fill
            className="object-cover"
          />
        </div>

        {/* 일기 이미지 */}
        <div className="flex-shrink-0 w-12 h-12 overflow-hidden">
          <Image
            src={diary.image_path || "/images/default-diary.png"}
            alt={diary.title}
            width={48}
            height={48}
            className="w-full h-full object-cover"
          />
        </div>

        {/* 텍스트 */}
        <div className="flex flex-col flex-1 min-w-0">
          <Typography.Body className="font-semibold truncate">
            {diary.title}
          </Typography.Body>
          <Typography.BodySmall className="text-gray-600">
            {dateLabel}
          </Typography.BodySmall>
        </div>
      </Flex.RowStartCenter>
    </Link>
  );
}
