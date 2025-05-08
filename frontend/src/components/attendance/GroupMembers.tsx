// GroupMembers.tsx
import { MemberLockedAmount } from "@/types/accounts";
import Image from "next/image";

import { FaRegCircle, FaRegCheckCircle } from "react-icons/fa";
import { Flex } from "../ui-components/layout/Flex";

interface GroupMemberProps {
  member: MemberLockedAmount;
  isSelected: boolean;
  onToggle: () => void;
}

export const GroupMembers = ({
  member,
  isSelected,
  onToggle,
}: GroupMemberProps) => {
  return (
    <div
      onClick={onToggle}
      className={`relative w-full rounded-xl transition-all cursor-pointer`}
    >
      <Flex.RowStartCenter className="gap-2">
        {isSelected ? (
          <FaRegCheckCircle className="text-[#22BD9C]" size={20} />
        ) : (
          <FaRegCircle className="text-gray-200" size={20} />
        )}
        <Image
          width={45}
          height={45}
          src={member.profile_image_url || "/images/default-avatar.png"}
          alt="프로필"
          className="rounded-full border border-gray-300"
        />

        <div className="flex-1">
          <p className="text-lg font-bold text-gray-800">{member.name}</p>
        </div>
      </Flex.RowStartCenter>
    </div>
  );
};
