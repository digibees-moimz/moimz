// src/app/groups/[groupId]/page.tsx

"use client";
import { useParams } from "next/navigation";
import GroupDetailSection from "@/components/group/GroupDetailSection";

export default function GroupDetailPage() {
  const { groupId } = useParams();
  const id = parseInt(groupId as string, 10);

  return <GroupDetailSection groupId={id} />;
}
