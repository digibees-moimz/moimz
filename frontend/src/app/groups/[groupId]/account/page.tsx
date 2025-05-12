// src/app/groups/[groupId]/account/page.tsx
"use client";
import { useParams } from "next/navigation";
import GroupAccountList from "@/components/group/GroupLockInStatus";
import { Typography } from "@/components/ui-components/typography/Typography";

export default function GroupAccountDetailPage() {
  const { groupId } = useParams();
  const id = parseInt(groupId as string, 10);

  return (
    <>
      <Typography.Heading3 className="mb-2">모임비 현황</Typography.Heading3>
      <GroupAccountList groupId={id} />
    </>
  );
}
