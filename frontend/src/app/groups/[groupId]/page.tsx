// src/app/groups/[groupId]/page.tsx

"use client";

import { useParams } from "next/navigation";
import GroupDetailSection from "@/components/group/GroupDetailSection";
import { useUserStore } from "@/stores/userStore";
import { ScheduleCard } from "@/components/schedule/ScheduleCard";
import { ScheduleEndBtn } from "@/components/schedule/ScheduleEndBtn";
import { useGroupUpcomingSchedule } from "@/hooks/schedule/useUpcomingSchedule";
import { formatTimeOnly, getDdayLabel } from "@/utils/formatDate";
import CharacterGenerateButton from "@/components/character/CharacterGenerateButton";
import { FloatingPayButton } from "@/components/pay/FloatingPayButton";
import { useGroups } from "@/hooks/useGroups";
import { useSchedule } from "@/hooks/schedule/useSchedule";
import { Container } from "@/components/ui-components/layout/Container";
import { useGroupColorStore } from "@/stores/useGroupColorStore";
import { Typography } from "@/components/ui-components/typography/Typography";
import { Flex } from "@/components/ui-components/layout/Flex";
import Image from "next/image";

export default function GroupDetailPage() {
  const { groupId } = useParams<{ groupId: string }>();
  const groupIdNum = Number(groupId);

  const { groupColorMap } = useGroupColorStore();
  const colorIndex = groupColorMap[groupIdNum] ?? 0;

  const { userId } = useUserStore();
  const { data: groups, refetch: refetchGroup } = useGroups(userId);

  const { usePendingSchedule } = useSchedule();
  const { data: pending } = usePendingSchedule(groupIdNum);

  const group = groups?.find((g) => g.id === groupIdNum);

  if (isNaN(groupIdNum)) return <div>잘못된 그룹입니다.</div>;

  const { data: next } = useGroupUpcomingSchedule(groupIdNum);
  return (
    <>
      {/* 모임통장 상세 */}
      <GroupDetailSection group={group} colorIndex={colorIndex} />

      <Container className="py-6 space-y-6">
        {/* 일정 종료 버튼 */}
        {pending && (
          <>
            <ScheduleEndBtn
              schedule={pending}
              groupId={groupIdNum}
              userId={userId}
            />
            <div className="bg-gray-100 h-[12px]" />
          </>
        )}

        {/* 다음 일정 */}
        {next && (
          <ScheduleCard
            type="next"
            groupId={groupIdNum}
            scheduleTitle={next.title}
            time={formatTimeOnly(next.date)}
            dday={getDdayLabel(next.date)}
          />
        )}

        <div className="bg-gray-100 h-[12px]" />

        {/* 캐릭터 생성 */}
        <Typography.Heading3>모임 캐릭터 뽑기</Typography.Heading3>
        <Flex.RowCenter className="gap-2">
          <Image
            src="/icons/ddockdi.png"
            alt="개발 중인 똑디"
            width={80}
            height={200}
          />
          <div className="relative bg-[#FFF3F6] rounded-xl p-4 max-w-xs text-sm shadow-sm">
            <div
              className="absolute -left-2 top-4 w-0 h-0 
          border-t-8 border-b-8 border-r-8
          border-t-transparent border-b-transparent border-r-[#FFF3F6]"
            />
            <Typography.BodySmall className="text-[#5B5B5B]">
              모임 활동을 열심히 하셨군요! ( ੭ ･ᴗ･ )੭
              <br />
              모임 포인트로 캐릭터를 뽑을 수 있어요
              <br />
              <span className="text-[#FC9DB3] font-bold">
                우리 모임만의 캐릭터
              </span>
              를 모아보세요!
            </Typography.BodySmall>
          </div>
        </Flex.RowCenter>
        <CharacterGenerateButton
          groupId={groupIdNum}
          onGenerated={() => refetchGroup()}
        />

        {/* 결제 버튼 */}
        <FloatingPayButton />
      </Container>
    </>
  );
}
