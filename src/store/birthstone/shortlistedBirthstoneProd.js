import { create } from "zustand";
import { persist } from "zustand/middleware";

export const shortlistedBirthstoneProd = create()(
  persist(
    (set, get) => ({
      likedProducts: [], // array of product IDs

      toggleLike: (product) => {
        const current = get().likedProducts;
        const alreadyLiked = current.includes(product.id);

        set({
          likedProducts: alreadyLiked
            ? current.filter((id) => id !== product.id) // remove
            : [...current, product.id], // add
        });
      },

      clearLikes: () => set({ likedProducts: [] }),
    }),
    {
      name: "liked-BirthstoneProd-storage",
    }
  )
);
