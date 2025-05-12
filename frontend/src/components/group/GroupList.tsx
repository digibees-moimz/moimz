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

  const colors = [
    { bg: "#EEFAF7", badge: "#C2EDE4", text: "#22BD9C" },
    { bg: "#F9FCE1", badge: "#D7ED54", text: "#a9bb3f" },
    { bg: "#FFF3F6", badge: "#FEC6D3", text: "#FA7E9B" },
    { bg: "#F4EFFB", badge: "#DFCDF9", text: "#B684FF" },
  ];

  return (
    <Flex.ColCenter className="gap-4">
      {groups.map((group, idx) => {
        const { bg, badge, text } = colors[idx % colors.length];

        return (
          <Link
            key={group.id}
            href={`/groups/${group.id}`}
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
