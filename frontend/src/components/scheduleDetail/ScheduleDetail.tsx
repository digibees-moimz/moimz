// src/components/scheduleDetail/ScheduleDetail.tsx
"use client";

import { useParams } from "next/navigation";
import { Flex } from "@/components/ui-components/layout/Flex";
import { Typography } from "@/components/ui-components/typography/Typography";
import { useScheduleDetail } from "@/hooks/useScheduleDetail";

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
      <Flex.ColStartCenter className="w-full">
        <Typography.Heading2 className="self-start">
          {schedule.title}
        </Typography.Heading2>
        <Flex.RowStartCenter className="gap-3 mt-2">
          {/* <img src={`/api/users/${schedule.user_id}/avatar`} alt="host avatar" className="w-10 h-10 rounded-full" /> */}
          <img
            src="/images/default-avatar.png"
            alt="host avatar"
            className="w-10 h-10 rounded-full"
          />
          <Flex.ColStartCenter className="self-start items-start">
            <Typography.BodyLarge>
              주최자 : {schedule.user_id}
            </Typography.BodyLarge>
            <Typography.Caption className="text-gray-500">
              {new Date(schedule.date).toLocaleString()} 작성
            </Typography.Caption>
          </Flex.ColStartCenter>
        </Flex.RowStartCenter>
      </Flex.ColStartCenter>

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
          {new Date(schedule.date)
            .toLocaleString("ko-KR", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
            .replace("오전", "AM")
            .replace("오후", "PM")}{" "}
          {/* 한국어 형식 -> 원하는 형식으로 수정 */}
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
            <Flex.RowStartCenter key={c.id} className="gap-3">
              {/* <img src={`/api/users/${c.user_id}/avatar`} alt="user avatar" className="w-8 h-8 rounded-full" /> */}
              <img
                src="/images/default-avatar.png"
                alt="user avatar"
                className="w-8 h-8 rounded-full"
              />
              <Flex.ColStartCenter className="self-start">
                <Typography.BodySmall className="font-medium">
                  사용자 {c.user_id}
                </Typography.BodySmall>
                <Typography.Body>{c.content}</Typography.Body>
                <Typography.Caption className="text-gray-400">
                  {new Date(c.created_at).toLocaleString()}
                </Typography.Caption>
              </Flex.ColStartCenter>
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
