// src/components/group/GroupList.tsx
"use client";

import { useGroups } from "@/hooks/useGroups";
import GroupCard from "./GroupCard";
import Link from "next/link";
import { Flex } from "@/components/ui-components/layout/Flex";
import { useUserStore } from "@/stores/userStore";

export default function GroupList() {
  const { userId } = useUserStore();
  const { data: groups, isLoading, error } = useGroups(userId);

  if (isLoading) return <p>로딩 중...</p>;
  if (error) return <p>에러: {error.message}</p>;
  if (!groups) return <p>모임 없음</p>;

  return (
    <Flex.ColCenter className="gap-4">
      {groups.map((group) => (
        <Link
          key={group.id}
          href={`/groups/${group.id}`}
          className="w-full p-4 bg-[#EEFAF7] rounded-xl hover:shadow transition"
        >
          <GroupCard group={group} />
        </Link>
      ))}
    </Flex.ColCenter>
  );
}
