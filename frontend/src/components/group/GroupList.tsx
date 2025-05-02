"use client";

import { useGroups } from "@/hooks/useGroups";
import GroupCard from "./GroupCard";
import Link from "next/link";
import { Flex } from "@/components/ui-components/layout/Flex";

export default function GroupList() {
  const userId = 1; // 🔥 로그인 연동 전까지는 이렇게 하드코딩
  const { groups, loading, error } = useGroups(userId);

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p>에러: {error}</p>;

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
