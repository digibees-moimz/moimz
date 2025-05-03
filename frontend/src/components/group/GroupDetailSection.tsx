// src/components/group/GroupDetailSection.tsx

import { useGroups } from "@/hooks/useGroups";
import GroupMainCard from "./GroupMainCard";
import { Typography } from "@/components/ui-components/typography/Typography";
import { Flex } from "@/components/ui-components/layout/Flex";

export default function GroupDetailSection({ groupId }: { groupId: number }) {
  const userId = 1;
  const { groups, loading, error } = useGroups(userId);

  if (loading) return <Typography.Body>로딩 중...</Typography.Body>;
  if (error) return <Typography.Body>에러: {error}</Typography.Body>;

  const group = groups.find((g) => g.id === groupId);
  if (!group)
    return <Typography.Body>모임을 찾을 수 없습니다.</Typography.Body>;

  return (
    <Flex.ColCenter className="w-full px-4 py-6 gap-6">
      <GroupMainCard group={group} />
      {/* 하단에 출석 현황, 결제 내역 등 컴포넌트 추가 가능 */}
    </Flex.ColCenter>
  );
}
