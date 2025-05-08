// hooks/useCharacter.ts
import { useMutation } from "@tanstack/react-query";
import { generateCharacter } from "@/api/character";
import { CharacterRead } from "@/types/character";

export function useGenerateCharacter(
  onSuccess?: (data: CharacterRead) => void
) {
  return useMutation({
    mutationFn: (groupId: number) => generateCharacter(groupId),
    onSuccess,
  });
}
