// src/components/group/GroupList.tsx
"use client";

import GroupCard from "./GroupCard";
import Link from "next/link";
import { Flex } from "@/components/ui-components/layout/Flex";
import { groupColorMap } from "@/constants/groupColorMap";
import { useGroupColorStore } from "@/stores/useGroupColorStore";
import { GroupType } from "@/types/group";

export default function GroupList({ groups }: { groups: GroupType[] }) {
  const { groupColorMap: colorMap, setGroupColor } = useGroupColorStore();

  return (
    <Flex.ColCenter className="gap-4">
      {groups.map((group, idx) => {
        const colorIndex = colorMap[group.id] ?? idx % groupColorMap.length;
        if (!(group.id in colorMap)) {
          setGroupColor(group.id, colorIndex);
        }

        const { bg, badge, text } = groupColorMap[colorIndex];

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
