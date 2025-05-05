// src/components/scheduleDetail/ScheduleDetail.tsx
"use client";

import { useParams } from "next/navigation";
import { Flex } from "@/components/ui-components/layout/Flex";
import { Typography } from "@/components/ui-components/typography/Typography";
import { useScheduleDetail } from "@/hooks/schedule/useScheduleDetail";
import { formatKoreanDateCustom } from "@/utils/formatDate";

export default function ScheduleDetail() {
  const { scheduleId } = useParams();
  const id = Number(scheduleId);
  const { data: schedule, isLoading, error } = useScheduleDetail(id);

  if (isLoading) return <Typography.Body>로딩 중…</Typography.Body>;
  if (error || !schedule)
    return (
      <Typography.Body>일정을 불러오는 데 오류가 발생했습니다.</Typography.Body>
    );

  return (
    <Flex.ColStartCenter className="bg-white rounded-2xl shadow p-6 max-w-xl mx-auto space-y-6">
      {/* 모임 상세 헤더 */}
      <Typography.Heading1>모임 상세</Typography.Heading1>

      {/* 제목 및 주최자 */}
      <Flex.RowStartStart className="w-full">
        <Flex.ColStartStart className="w-full">
          <Typography.Heading2>{schedule.title}</Typography.Heading2>
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

      {/* 메인 이미지 */}
      <div className="w-full rounded-xl overflow-hidden">
        {/* <img src={`/api/schedules/${schedule.id}/image`} alt="schedule image" className="w-full h-48 object-cover" /> */}
        <img
          src="/images/default-schedule.png"
          alt="schedule image"
          className="w-full h-48 object-cover"
        />
      </div>

      {/* 장소 및 지도 */}
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

      {/* 댓글 */}
      <div className="w-full space-y-4">
        <Typography.Heading3>댓글</Typography.Heading3>
        {schedule.comments && schedule.comments.length === 0 ? (
          <Typography.BodySmall>댓글이 없습니다.</Typography.BodySmall>
        ) : schedule.comments ? (
          schedule.comments.map((c) => (
            <Flex.RowStartCenter key={c.id} className="w-full gap-3">
              <img
                src="/images/default-avatar.png"
                alt="user avatar"
                className="w-10 h-10 rounded-full"
              />
              <div className="grid grid-cols-[auto_1fr] gap-2 w-full items-center">
                {/* 왼쪽: 이름 + 날짜 */}
                <div className="flex flex-col items-start w-20">
                  <Typography.BodySmall className="font-medium">
                    {c.user.name}
                  </Typography.BodySmall>
                  <Typography.Caption className="text-gray-400 whitespace-nowrap">
                    {formatKoreanDateCustom(c.created_at, {
                      month: true,
                      day: true,
                      hour: true,
                      minute: true,
                    })}
                  </Typography.Caption>
                </div>

                {/* 오른쪽: 댓글 내용 */}
                <Typography.BodySmall>{c.content}</Typography.BodySmall>
              </div>
            </Flex.RowStartCenter>
          ))
        ) : (
          <Typography.BodySmall>
            댓글 정보를 불러오는 중입니다.
          </Typography.BodySmall>
        )}
      </div>
    </Flex.ColStartCenter>
  );
}
