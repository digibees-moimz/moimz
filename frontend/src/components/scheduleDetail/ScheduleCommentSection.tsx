// src/components/scheduleDetail/ScheduleCommentSection.tsx
"use client";

import { Flex } from "@/components/ui-components/layout/Flex";
import { Typography } from "@/components/ui-components/typography/Typography";
import { formatKoreanDateCustom } from "@/utils/formatDate";
import ScheduleCommentForm from "./ScheduleCommentForm";
import type { ScheduleDetail as ScheduleDetailType } from "@/types/schedule";
import { IoChatboxEllipsesOutline } from "react-icons/io5";

interface Props {
  schedule: ScheduleDetailType;
  onRefetch: () => void;
}

export default function ScheduleCommentSection({ schedule, onRefetch }: Props) {
  console.log(schedule.comments);
  return (
    <div className="max-w-xl mx-auto space-y-4 mt-4">
      {/* 댓글 */}
      <Typography.Heading4 className="flex gap-1 items-center mt-3 text-gray-600">
        댓글 <IoChatboxEllipsesOutline color="gray" size={20} />
      </Typography.Heading4>

      {schedule.comments.length === 0 ? (
        <Typography.BodySmall>댓글이 없습니다.</Typography.BodySmall>
      ) : (
        schedule.comments.map((c) => (
          <Flex.RowStartCenter key={c.id} className="w-full gap-3 items-start">
            <img
              src={c.user.profile_image_url || "/images/default-avatar.png"}
              alt="프로필 이미지"
              className="w-10 h-10 rounded-full"
            />
            <div className="flex flex-col w-full">
              <div className="flex items-center gap-2">
                <Typography.BodySmall className="font-medium">
                  {c.user.name}
                </Typography.BodySmall>
                <span className="text-gray-400 text-xs">
                  {formatKoreanDateCustom(c.created_at, {
                    month: true,
                    day: true,
                    hour: true,
                    minute: true,
                  })}
                </span>
              </div>
              <Typography.BodySmall className="mt-1">
                {c.content}
              </Typography.BodySmall>
            </div>
          </Flex.RowStartCenter>
        ))
      )}
      {/* 댓글 입력 창 */}
      <ScheduleCommentForm scheduleId={schedule.id} onSuccess={onRefetch} />
    </div>
  );
}
