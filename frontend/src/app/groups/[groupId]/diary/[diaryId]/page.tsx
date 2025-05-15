"use client";

import { useParams } from "next/navigation";
import { useDiary } from "@/hooks/useDiary";
import DiaryDetail from "@/components/diary/DiaryDetail";
import { LoadingBar } from "@/components/ui-components/shared/LoadingBar";

export default function Page() {
  const { diaryId } = useParams();
  const { useDiaryById } = useDiary();

  const { data: diary, isLoading, error } = useDiaryById(Number(diaryId));

  if (isLoading) return <LoadingBar />;
  if (error || !diary)
    return <div className="p-4 text-red-500">일기를 찾을 수 없습니다.</div>;

  return <DiaryDetail diary={diary} />;
}
