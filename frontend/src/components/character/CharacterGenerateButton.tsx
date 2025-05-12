// src/components/character/createButton.tsx

import { useGenerateCharacter } from "@/hooks/useCharacter";
import { Button } from "@/components/ui-components/ui/Button";

interface Props {
  groupId: number;
  onGenerated?: () => void;
}

export default function CharacterGenerateButton({
  groupId,
  onGenerated,
}: Props) {
  const { mutate, isPending } = useGenerateCharacter(() => {
    onGenerated?.();
  });

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={() => mutate(groupId)}
      disabled={isPending}
    >
      {isPending ? "생성 중..." : "캐릭터 생성"}
    </Button>
  );
}
