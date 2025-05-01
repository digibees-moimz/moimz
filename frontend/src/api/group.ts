// src/api/group.ts
// import axios from "@/lib/axios";
import { GroupType } from "@/types/group";
import { mockGroups } from "@/mocks/group"; // mock 데이터 import

export async function fetchGroups(): Promise<GroupType[]> {
  return new Promise((resolve) => setTimeout(() => resolve(mockGroups), 300));
}
