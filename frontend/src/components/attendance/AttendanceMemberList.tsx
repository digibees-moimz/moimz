// src/components/attendance/AttendanceMemberList.tsx
import { MemberLockedAmount } from "@/types/accounts";
import { GroupMembers } from "./GroupMembers";

interface Props {
  members: MemberLockedAmount[];
  selectedIds: number[];
  onToggle: (id: number) => void;
}

export const AttendanceMemberList = ({
  members,
  selectedIds,
  onToggle,
}: Props) => {
  return (
    <div className="space-y-3">
      {members.map((member) => {
        const id = member.user_account_id;
        return (
          <GroupMembers
            key={id}
            member={member}
            isSelected={selectedIds.includes(id)}
            onToggle={() => onToggle(id)}
          />
        );
      })}
    </div>
  );
};
