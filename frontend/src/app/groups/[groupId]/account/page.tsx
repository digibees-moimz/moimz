// src/app/groups/[groupId]/account/page.tsx
"use client";
import { useParams } from "next/navigation";
import GroupAccountList from "@/components/group/GroupLockInStatus";

export default function GroupAccountDetailPage() {
  const { groupId } = useParams();
  const id = parseInt(groupId as string, 10);

  return (
    <main className="p-4 space-y-6">
      <h2 className="text-xl font-bold">모임비 현황</h2>
      <GroupAccountList groupId={id} />
    </main>
  );
}
