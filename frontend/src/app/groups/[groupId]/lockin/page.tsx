// src/app/groups/[groupId]/lockin/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useGroups } from "@/hooks/useGroups";
import { useUserStore } from "@/stores/userStore";
import { useLockInMutation } from "@/hooks/useLockIn";
import LockInPageView from "@/components/lockin/LockInPageView";

export default function LockInPage() {
  const { groupId: groupIdParam } = useParams<{ groupId: string }>();
  const groupId = Number(groupIdParam);

  const router = useRouter();
  const { userId } = useUserStore();

  // 그룹 목록 가져오기
  const { data: groups, isLoading } = useGroups(userId);

  // 락인/락아웃 mutation 핸들러
  const { lockIn, lockOut } = useLockInMutation(userId);

  if (isLoading || !groups) return <div>로딩중...</div>;

  const group = groups.find((g) => g.id === groupId);
  if (!group) return <div>모임을 찾을 수 없습니다.</div>;

  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <LockInPageView
        group={group}
        currentLockedAmount={group.locked_amount}
        onLockIn={async (amount) => {
          await lockIn.mutateAsync({ groupId: group.id, amount });
          router.back(); // 돌아가기
        }}
        onLockOut={async (amount) => {
          await lockOut.mutateAsync({ groupId: group.id, amount });
          router.back();
        }}
      />
    </div>
  );
}
