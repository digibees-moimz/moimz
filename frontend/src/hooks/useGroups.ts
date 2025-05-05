// src/hooks/useGroups.ts

"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchGroups } from "@/api/group";
import { GroupType } from "@/types/group";

export function useGroups(userId: number = 1) {
  return useQuery<GroupType[]>({
    queryKey: ["groups", userId],
    queryFn: () => fetchGroups(userId),
  });
}
