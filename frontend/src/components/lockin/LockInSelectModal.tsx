// src/components/lockin/LockInSelectModal.tsx
import { GroupType } from "@/types/group";
import { Flex } from "@/components/ui-components/layout/Flex";
import { Typography } from "@/components/ui-components/typography/Typography";

export interface LockInSelectModalProps {
  groups: GroupType[];
  onSelect: (group: GroupType) => void;
  onClose: () => void;
}

export default function LockInSelectModal({
  groups,
  onSelect,
  onClose,
}: LockInSelectModalProps) {
  return (
    <Flex.ColCenter className="fixed inset-0 bg-black/50 z-50">
      <div className="bg-white rounded-2xl p-6 w-80 shadow-xl">
        <Typography.Heading3 className="mb-4 text-center">
          어떤 모임통장의 락인을
          <br />
          관리할까요?
        </Typography.Heading3>

        <Flex.ColStartCenter className="gap-2 w-full">
          {groups.map((group) => (
            <button
              key={group.id}
              onClick={() => onSelect(group)}
              className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 transition"
            >
              <Flex.RowStartCenter className="gap-2">
                <img
                  src={group.image_url}
                  alt="캐릭터"
                  className="w-8 h-8 object-cover rounded"
                />
                <Typography.Body className="text-sm">
                  {group.name}
                </Typography.Body>
              </Flex.RowStartCenter>
              <Typography.Caption>
                {group.locked_amount.toLocaleString()}원
              </Typography.Caption>
            </button>
          ))}
        </Flex.ColStartCenter>

        <button
          onClick={onClose}
          className="mt-4 w-full text-sm bg-gray-200 py-2 rounded-lg"
        >
          닫기
        </button>
      </div>
    </Flex.ColCenter>
  );
}
