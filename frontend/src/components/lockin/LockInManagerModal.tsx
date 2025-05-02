// src/components/lockin/LockinManagerModal.tsx
"use client";

import { useState } from "react";
import LockInSelectModal from "./LockInSelectModal";
import LockInActionModal from "./LockInActionModal";
import { useLockIn } from "../../hooks/useLockIn";
import { GroupType } from "../../types/group";
import React from "react";

interface LockInManagerModalProps {
  userId: number;
  open: boolean;
  onClose: () => void;
  groups: GroupType[]; // 사용 가능한 모임 리스트
}

export default function LockInManagerModal({
  userId,
  open,
  onClose,
  groups,
}: LockInManagerModalProps) {
  const [step, setStep] = useState<"select" | "action">("select");
  const [selectedGroup, setSelectedGroup] = useState<GroupType | null>(null);
  const { lockIn, lockOut } = useLockIn(userId);

  if (!open) return null;

  return (
    <>
      {step === "select" && (
        <LockInSelectModal
          groups={groups}
          onSelect={(group) => {
            setSelectedGroup(group);
            setStep("action");
          }}
          onClose={onClose}
        />
      )}

      {step === "action" && selectedGroup && (
        <LockInActionModal
          group={selectedGroup}
          currentLockedAmount={selectedGroup.locked_amount}
          onLockIn={async (amount) => {
            await lockIn(selectedGroup.id, amount);
            onClose(); // or go back to select
          }}
          onLockOut={async (amount) => {
            await lockOut(selectedGroup.id, amount);
            onClose();
          }}
          onClose={() => setStep("select")}
        />
      )}
    </>
  );
}
