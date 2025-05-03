// src/store/userStore.ts
import { create } from "zustand";

interface UserState {
  userId: number;
  setUserId: (id: number) => void;
}

export const useUserStore = create<UserState>((set) => ({
  userId: 1, // 초기값 (하드코딩 대신 여기에만 쓰기)
  setUserId: (id) => set({ userId: id }),
}));
