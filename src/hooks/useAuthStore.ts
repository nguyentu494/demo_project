import { create } from "zustand";

interface AuthState {
  username: string;
  setUsername: (username: string) => void;
  clearUsername: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  username: "",
  setUsername: (username) => set({ username }),
  clearUsername: () => set({ username: "" }),
}));
