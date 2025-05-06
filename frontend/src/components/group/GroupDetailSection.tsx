// src/components/group/GroupDetailSection.tsx

import { useGroups } from "@/hooks/useGroups";
import GroupMainCard from "./GroupMainCard";
import { Typography } from "@/components/ui-components/typography/Typography";
import { Flex } from "@/components/ui-components/layout/Flex";
import { useUserStore } from "@/stores/userStore";

export default function GroupDetailSection({ groupId }: { groupId: number }) {
  const { userId } = useUserStore();
  const { data: groups, isLoading, error } = useGroups(userId);

  if (isLoading) return <Typography.Body>로딩 중...</Typography.Body>;
  if (error) return <Typography.Body>에러: {error.message}</Typography.Body>;
  if (!groups) return <Typography.Body>모임이 없습니다.</Typography.Body>;

  const group = groups.find((g) => g.id === groupId);
  if (!group)
    return <Typography.Body>모임을 찾을 수 없습니다.</Typography.Body>;

  return (
    <Flex.ColCenter>
      <GroupMainCard group={group} />
    </Flex.ColCenter>
  );
}
