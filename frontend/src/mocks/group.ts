// src/mocks/group.ts
import { GroupType } from "@/types/group";

export const mockGroups: GroupType[] = [
  {
    id: 1,
    name: "단디 여행가자",
    category: "여행 모임",
    locked_amount: 100000,
    image_url: "/group-images/dandi.png",
  },
  {
    id: 2,
    name: "독디 스터디 모임통장",
    category: "스터디",
    locked_amount: 70000,
    image_url: "/group-images/book.png",
  },
];
