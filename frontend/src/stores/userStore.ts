// src/store/userStore.ts
import { create } from "zustand";

interface UserState {
  userId: number;
  setUserId: (id: number) => void;
}

export const useUserStore = create<UserState>()((set) => ({
  userId: 6,
  setUserId: (id: number) => set({ userId: id }),
}));
