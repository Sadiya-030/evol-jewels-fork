import { create } from "zustand";
import { persist } from "zustand/middleware";

export const browseStore = create(
  persist(
    (set) => ({
      browseProducts: [],

      // hydration flag
      hasHydrated: false,

      setBrowseProducts: (products) => set({ browseProducts: products }),

      clearBrowseProducts: () => set({ browseProducts: [] }),

      setHasHydrated: () => set({ hasHydrated: true }),
    }),
    {
      name: "browse-products-storage",

      // runs AFTER localStorage is loaded
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated();
      },
    }
  )
);
