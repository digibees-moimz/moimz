// src/app/groups/[groupId]/diary/page.tsx
"use client";

import { useParams } from "next/navigation";
import { useDiary } from "@/hooks/useDiary";
import { Typography } from "@/components/ui-components/typography/Typography";
import DiaryListItem from "@/components/diary/DiaryListItem";
import { LoadingBar } from "@/components/ui-components/shared/LoadingBar";

export default function Page() {
  const params = useParams<{ groupId: string }>();
  const groupId = Number(params.groupId);
  const { useDiaryByGroup } = useDiary();

  const { data: diaries, isLoading, error } = useDiaryByGroup(groupId);

  if (isLoading) return <LoadingBar />;
  if (error)
    return <div className="text-red-500">일기를 불러오지 못했어요.</div>;
  if (!diaries || diaries.length === 0)
    return <div>아직 작성된 모임 일기가 없습니다.</div>;

  return (
    <div>
      {/* 페이지 헤더 */}
      <Typography.Heading3 className="mb-4">모임 일기</Typography.Heading3>

      {/* 일기 리스트 */}
      <div className="space-y-2">
        {diaries.map((diary) => (
          <DiaryListItem key={diary.id} diary={diary} groupId={groupId} />
        ))}
      </div>
    </div>
  );
}
