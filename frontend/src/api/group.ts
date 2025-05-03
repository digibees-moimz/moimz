import axios from "@/lib/axios";
import { GroupType } from "@/types/group";

export async function fetchGroups(userId: number): Promise<GroupType[]> {
  const response = await axios.get<GroupType[]>(`api/users/${userId}/groups`);
  return response.data;
}
