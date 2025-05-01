"use client";

import { useGroups } from "@/hooks/useGroups";
import GroupCard from "./GroupCard";
import Link from "next/link";
import { Flex } from "@/components/ui-components/layout/Flex";

export default function GroupList() {
  const { groups, loading, error } = useGroups();

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
