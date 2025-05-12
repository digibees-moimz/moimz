// src/components/group/GroupDetailSection.tsx

import { GroupType } from "@/types/group";
import { Typography } from "../ui-components/typography/Typography";
import GroupMainCard from "./GroupMainCard";
import { groupColorMap } from "@/constants/groupColorMap";

interface GroupMainCardProps {
  group?: GroupType;
  groupIndex: number;
}

export default function GroupDetailSection({
  group,
  groupIndex,
}: GroupMainCardProps) {
  const { bg, badge, text } = groupColorMap[groupIndex % groupColorMap.length];

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
