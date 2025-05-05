// src/api/account.ts
import axios from "@/lib/axios";
import { GroupAccountSummary } from "@/types/accounts";

export async function fetchGroupAccountSummary(
  groupId: number
): Promise<GroupAccountSummary> {
  const response = await axios.get<GroupAccountSummary>(
    `/api/groups/${groupId}/account/summary`
  );
  return response.data;
}
