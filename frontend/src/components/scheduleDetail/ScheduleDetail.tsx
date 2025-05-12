// src/components/scheduleDetail/ScheduleDetail.tsx
"use client";

import { Flex } from "@/components/ui-components/layout/Flex";
import { Typography } from "@/components/ui-components/typography/Typography";
import { formatKoreanDateCustom } from "@/utils/formatDate";
import type { ScheduleDetail as ScheduleDetailType } from "@/types/schedule";
import ScheduleCommentForm from "./ScheduleCommentForm";
import DiaryLink from "../diary/DiaryLink";

interface ScheduleDetailProps {
  schedule: ScheduleDetailType;
  onRefetch: () => void;
}

export default function ScheduleDetail({
  schedule,
  onRefetch,
}: ScheduleDetailProps) {
  return (
    <Flex.ColStartCenter className="bg-white rounded-2xl shadow p-6 max-w-xl mx-auto space-y-6">
      <Typography.Heading1>모임 상세</Typography.Heading1>

      <Flex.RowStartStart className="w-full">
        <Flex.ColStartStart className="w-full">
          <Flex.RowBetweenCenter className="w-full">
            <Typography.Heading2>{schedule.title}</Typography.Heading2>
            {schedule.diary_id && (
              <DiaryLink
                diaryId={schedule.diary_id}
                groupId={schedule.group_id}
              />
            )}
          </Flex.RowBetweenCenter>{" "}
          <Flex.RowStartCenter className="gap-3 mt-2">
            <img
              src={
                schedule.user.profile_image_url || "/images/default-avatar.png"
              }
              alt={`${schedule.user.name}의 프로필`}
              className="w-10 h-10 rounded-full"
            />
            <Flex.ColStartStart>
              <Typography.BodyLarge>{schedule.user.name}</Typography.BodyLarge>
              <Typography.Caption className="text-gray-500">
                {formatKoreanDateCustom(schedule.created_at, {
                  year: true,
                  month: true,
                  day: true,
                  hour: true,
                  minute: true,
                })}
              </Typography.Caption>
            </Flex.ColStartStart>
          </Flex.RowStartCenter>
        </Flex.ColStartStart>
      </Flex.RowStartStart>

      <div className="w-full rounded-xl overflow-hidden">
        <img
          src="/images/default-schedule.png"
          alt="schedule image"
          className="w-full h-48 object-cover"
        />
      </div>

      <div className="w-full space-y-2">
        <Typography.BodyLarge>
          {schedule.description || "모임 일정입니다"}
        </Typography.BodyLarge>
        <Typography.BodySmall>
          일시:{" "}
          {formatKoreanDateCustom(schedule.date, {
            year: true,
            month: true,
            day: true,
            hour: true,
            minute: true,
          })}
        </Typography.BodySmall>
        <Typography.BodySmall>
          장소: {schedule.location || "장소 미정"}
        </Typography.BodySmall>
      </div>

      <div className="w-full space-y-4">
        <ScheduleCommentForm scheduleId={schedule.id} onSuccess={onRefetch} />
        <Typography.Heading3>댓글</Typography.Heading3>
        {schedule.comments.length === 0 ? (
          <Typography.BodySmall>댓글이 없습니다.</Typography.BodySmall>
        ) : (
          schedule.comments.map((c) => (
            <Flex.RowStartCenter
              key={c.id}
              className="w-full gap-3 items-start"
            >
              <img
                src="/images/default-avatar.png"
                alt="user avatar"
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
                <div className="flex items-start mt-1">
                  <div className="bg-gray-300 rounded-sm h-full mt-0.5" />
                  <Typography.BodySmall>{c.content}</Typography.BodySmall>
                </div>
              </div>
            </Flex.RowStartCenter>
          ))
        )}
      </div>
    </Flex.ColStartCenter>
  );
}
