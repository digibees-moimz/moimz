// src/components/scheduleDetail/ScheduleDetail.tsx
"use client";

import { Flex } from "@/components/ui-components/layout/Flex";
import { Typography } from "@/components/ui-components/typography/Typography";
import { formatKoreanDateCustom } from "@/utils/formatDate";
import type { ScheduleDetail as ScheduleDetailType } from "@/types/schedule";
import ScheduleCommentForm from "./ScheduleCommentForm";
import DiaryLink from "../diary/DiaryLink";
import { FaCalendarAlt, FaRegClock, FaMapMarkerAlt } from "react-icons/fa";

interface ScheduleDetailProps {
  schedule: ScheduleDetailType;
  onRefetch: () => void;
}

export default function ScheduleDetail({
  schedule,
  onRefetch,
}: ScheduleDetailProps) {
  return (
    <Flex.ColStartCenter className="bg-white rounded-2xl max-w-xl mx-auto space-y-6">
      <Flex.RowStartStart className="w-full">
        <Flex.ColStartStart className="w-full">
          <Flex.RowBetweenCenter className="w-full">
            <Typography.Heading3>{schedule.title}</Typography.Heading3>
            {schedule.diary_id && (
              <DiaryLink
                diaryId={schedule.diary_id}
                groupId={schedule.group_id}
              />
            )}
          </Flex.RowBetweenCenter>
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

        <div className="px-5 p-3 space-y-2 bg-[#F4EFFB] rounded-lg ">
          <Typography.BodySmall className="flex items-center gap-1">
            <FaRegClock color="gray" />
            일시:{" "}
            {formatKoreanDateCustom(schedule.date, {
              year: true,
              month: true,
              day: true,
              hour: true,
              minute: true,
            })}
          </Typography.BodySmall>
          <Typography.BodySmall className="flex items-center gap-1">
            <FaMapMarkerAlt color="gray" />
            장소: {schedule.location || "장소 미정"}
          </Typography.BodySmall>
        </div>
      </div>
    </Flex.ColStartCenter>
  );
}
