import { create } from "zustand";
import { persist } from "zustand/middleware";

export const charmsCode = create()(
  persist(
    (set) => ({
      charmsSize: null,
      allCharms: [],

      setCharmsSize: (data) => set({ charmsSize: data }),
      setAllCharms: (data) => set({ allCharms: data }),
      clearCharmsCode: () => set({ charmsSize: null, allCharms: [] }),
    }),
    {
      name: "browse-charmsCode-storage",
    }
  )
);
