import { create } from "zustand";
import { persist } from "zustand/middleware";

export const usePreferenceProdStore = create(
  persist(
    (set) => ({
      liked: new Set(),

      toggleLike: (prod) =>
        set((state) => {
          const id = prod.shopifyData?.id;
          if (!id) return state;

          const newSet = new Set(state.liked);

          if (newSet.has(id)) newSet.delete(id);
          else newSet.add(id);

          return { liked: newSet };
        }),

      clearPreferenceProd: () => set({ liked: new Set() }),
    }),

    {
      name: "preference-prod-store",

      // Save Set → Array
      partialize: (state) => ({
        liked: Array.from(state.liked),
      }),

      // Restore Array → Set
      merge: (persisted, current) => ({
        ...current,
        ...persisted,
        liked: new Set(persisted?.liked || []),
      }),
    }
  )
);
