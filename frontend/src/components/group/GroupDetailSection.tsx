// src/components/group/GroupDetailSection.tsx

import { GroupType } from "@/types/group";
import { Typography } from "../ui-components/typography/Typography";
import GroupMainCard from "./GroupMainCard";
import { groupColorMap } from "@/constants/groupColorMap";

interface GroupMainCardProps {
  group?: GroupType;
  colorIndex: number;
}

export default function GroupDetailSection({
  group,
  colorIndex,
}: GroupMainCardProps) {
  const { bg, badge, text } = groupColorMap[colorIndex % groupColorMap.length];

  if (!group)
    return <Typography.Body>모임을 찾을 수 없습니다.</Typography.Body>;

  return (
    <div>
      <GroupMainCard
        group={group}
        backgroundColor={bg}
        badgeColor={badge}
        textColor={text}
      />
    </div>
  );
}
