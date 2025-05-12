// src/components/group/GroupList.tsx
"use client";

import { useGroups } from "@/hooks/useGroups";
import GroupCard from "./GroupCard";
import Link from "next/link";
import { Flex } from "@/components/ui-components/layout/Flex";
import { useUserStore } from "@/stores/userStore";
import { groupColorMap } from "@/constants/groupColorMap";

export default function GroupList() {
  const { userId } = useUserStore();
  const { data: groups, isLoading, error } = useGroups(userId);

  if (isLoading) return <p>로딩 중...</p>;
  if (error) return <p>에러: {error.message}</p>;
  if (!groups) return <p>모임 없음</p>;

  return (
    <Flex.ColCenter className="gap-4">
      {groups.map((group, idx) => {
        const { bg, badge, text } = groupColorMap[idx % groupColorMap.length];

        return (
          <Link
            key={group.id}
            href={{
              pathname: `/groups/${group.id}`,
              query: { i: idx % groupColorMap.length },
            }}
            className="w-full p-4 rounded-xl hover:shadow transition"
            style={{ backgroundColor: bg }}
          >
            <GroupCard group={group} badgeColor={badge} textColor={text} />
          </Link>
        );
      })}
    </Flex.ColCenter>
  );
}
