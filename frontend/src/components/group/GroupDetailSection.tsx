// src/components/group/GroupDetailSection.tsx

import { GroupType } from "@/types/group";
import { Typography } from "../ui-components/typography/Typography";
import GroupMainCard from "./GroupMainCard";
import { Flex } from "../ui-components/layout/Flex";

export default function GroupDetailSection({ group }: { group?: GroupType }) {
  if (!group)
    return <Typography.Body>모임을 찾을 수 없습니다.</Typography.Body>;

  return (
    <Flex.ColCenter>
      <GroupMainCard group={group} />
    </Flex.ColCenter>
  );
}
