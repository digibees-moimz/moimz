// src/hooks/useGroups.ts

"use client";

import { useEffect, useState } from "react";
import { GroupType } from "@/types/group";
import { fetchGroups } from "@/api/group";

export function useGroups() {
  const [groups, setGroups] = useState<GroupType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGroups()
      .then(setGroups)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { groups, loading, error };
}
