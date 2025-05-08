// src/api/character.ts
import axios from "@/lib/axios";
import { CharacterRead } from "@/types/character";

export async function generateCharacter(
  groupId: number
): Promise<CharacterRead> {
  const res = await axios.post(`/api/groups/${groupId}/generate-character`);
  return res.data;
}
