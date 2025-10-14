import { create } from "zustand";
import { persist } from "zustand/middleware";
interface AuthState {
  username: string;
  cooldown: number;
  setUsername: (username: string) => void;
  clearUsername: () => void;
  setCooldown: (cooldown: number) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      username: "",
      cooldown: 0,
      setUsername: (username) => set({ username }),
      clearUsername: () => set({ username: "" }),
      setCooldown: (cooldown) => set({ cooldown }),
    }),
    { name: "auth-storage" }
  )
);
