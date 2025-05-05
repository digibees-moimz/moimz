// src/app/groups/[groupId]/page.tsx

"use client";
import { useParams } from "next/navigation";
import { useState } from "react";
import GroupDetailSection from "@/components/group/GroupDetailSection";
import LockInManagerModal from "@/components/lockin/LockInManagerModal";
import { useGroups } from "@/hooks/useGroups";
import { useUserStore } from "@/stores/userStore";

export default function GroupDetailPage() {
  const { groupId } = useParams();
  const id = parseInt(groupId as string, 10);
  const { userId } = useUserStore(); // ✅ 여기로 대체
  const [modalOpen, setModalOpen] = useState(false);
  const { data: groups } = useGroups(userId);

  return (
    <>
      <GroupDetailSection groupId={id} />
      <div className="px-4 mt-4">
        <button
          onClick={() => setModalOpen(true)}
          className="text-sm bg-emerald-400 text-white px-4 py-2 rounded-md"
        >
          락인 관리
        </button>
      </div>
      {groups && (
        <LockInManagerModal
          userId={userId}
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          groups={groups}
        />
      )}
    </>
  );
}
