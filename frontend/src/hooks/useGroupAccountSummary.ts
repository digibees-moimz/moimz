// src/hooks/useGroupAccountSummary.ts
import { fetchGroupAccountSummary } from "@/api/account";
import { useQuery } from "@tanstack/react-query";

export const useGroupAccountSummary = (groupId: number) =>
  useQuery({
    queryKey: ["groupAccountSummary", groupId],
    queryFn: () => fetchGroupAccountSummary(groupId),
    staleTime: 60 * 1000, // 1분 캐시
    enabled: !!groupId, // 0 일 때 호출 방지
  });
