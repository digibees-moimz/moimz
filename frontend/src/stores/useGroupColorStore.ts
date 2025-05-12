import { create } from "zustand";

interface GroupColorStore {
  groupColorMap: Record<number, number>; // groupId → colorIndex
  setGroupColor: (groupId: number, index: number) => void;
}

export const useGroupColorStore = create<GroupColorStore>((set) => ({
  groupColorMap: {},
  setGroupColor: (groupId, index) =>
    set((state) => ({
      groupColorMap: { ...state.groupColorMap, [groupId]: index },
    })),
}));
