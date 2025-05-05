// src/api/account.ts
import axios from "@/lib/axios";
import { GroupAccountSummary } from "@/types/accounts";

export async function fetchGroupAccountSummary(
  groupId: number
): Promise<GroupAccountSummary> {
  return axios.get(`/api/groups/${groupId}/account/summary`);
}
