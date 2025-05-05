import { GroupType } from "@/types/group";
import { Typography } from "@/components/ui-components/typography/Typography";
import { Flex } from "@/components/ui-components/layout/Flex";

interface GroupMainCardProps {
  group: GroupType;
}

export default function GroupMainCard({ group }: GroupMainCardProps) {
  const {
    name,
    category = "기본 모임",
    image_url = "/character/default.png",
    group_balance = 0,
    locked_amount = 0,
    member_count = 1,
    account_number,
  } = group;

  return (
    <Flex.RowBetweenCenter className="w-full bg-[#EEFAF7] p-6">
      {/* Left */}
      <Flex.ColStartCenter className="items-start gap-2 w-auto h-auto">
        <Flex.RowStartCenter className="gap-2 w-auto h-auto">
          <div className="text-xs bg-yellow-400 px-2 py-0.5 rounded-full">
            {member_count}명
          </div>
          <div className="text-xs bg-emerald-400 text-white px-2 py-0.5 rounded-full">
            {category}
          </div>
        </Flex.RowStartCenter>

        <Typography.Heading2>{name}</Typography.Heading2>
        <Typography.BodySmall className="text-gray-400">
          {account_number}
        </Typography.BodySmall>

        <Typography.Display className="text-black">
          {group_balance.toLocaleString()}원
        </Typography.Display>

        <Typography.BodySmall className="text-gray-500">
          내 락인 금액{" "}
          <span className="font-bold text-black">
            {locked_amount.toLocaleString()}원
          </span>
        </Typography.BodySmall>
      </Flex.ColStartCenter>

      {/* Right */}
      <Flex.ColCenter className="w-auto h-auto">
        <img
          src={image_url}
          alt="캐릭터"
          className="w-24 h-24 object-contain"
        />
      </Flex.ColCenter>
    </Flex.RowBetweenCenter>
  );
}
