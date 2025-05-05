// src/api/group.ts
import axios from "@/lib/axios";
import { GroupType } from "@/types/group";

export async function fetchGroups(userId: number): Promise<GroupType[]> {
  return await axios.get(`/api/users/${userId}/groups`);
}
