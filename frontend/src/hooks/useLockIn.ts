// src/hooks/useLockin.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postLockIn, postLockOut } from "@/api/lockin";

export function useLockInMutation(userId: number) {
  const queryClient = useQueryClient();

  const lockIn = useMutation({
    mutationFn: (params: { groupId: number; amount: number }) =>
      postLockIn(userId, params.groupId, params.amount),
    onSuccess: () => {
      // 예: 락인 성공 시 해당 그룹의 계좌 요약 정보 refetch
      queryClient.invalidateQueries({ queryKey: ["groupAccountSummary"] });
    },
  });

  const lockOut = useMutation({
    mutationFn: (params: { groupId: number; amount: number }) =>
      postLockOut(userId, params.groupId, params.amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groupAccountSummary"] });
    },
  });

  return { lockIn, lockOut };
}
