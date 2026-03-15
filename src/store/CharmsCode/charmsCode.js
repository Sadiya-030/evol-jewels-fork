import { create } from "zustand";
import { persist } from "zustand/middleware";

export const charmsCode = create()(
  persist(
    (set) => ({
      charmsSize: null,

      setCharmsSize: (data) => set({ charmsSize: data }),
      clearCharmsCode: () => set({ charmsSize: null }),
    }),
    {
      name: "browse-charmsCode-storage",
    }
  )
);
