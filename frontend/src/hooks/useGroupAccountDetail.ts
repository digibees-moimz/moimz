// src/hooks/useGroupAccountDetail.ts
import { useQuery } from "@tanstack/react-query";
import { fetchGroupAccountSummary } from "@/api/account";
import { GroupAccountSummary } from "@/types/accounts";

export function useGroupAccountDetail(groupId: number) {
  return useQuery<GroupAccountSummary>({
    queryKey: ["groupAccountSummary", groupId],
    queryFn: () => fetchGroupAccountSummary(groupId),
    staleTime: 1000 * 60 * 5, // 5분간 캐시 유지 (선택)
    enabled: !!groupId, // groupId가 있을 때만 실행
  });
}
