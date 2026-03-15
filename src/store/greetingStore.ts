import { create } from "zustand";
import { persist } from "zustand/middleware";
const emptySelectedCard = {
templateName: "",
        msg: "",
        img: "",
        theirName: "",
        yourName: "",
};
export const useGreetingStore = create(
  persist(
    (set) => ({
      selectedCard: {
        templateName: "",
        msg: "",
        img: "",
        theirName: "",
        yourName: "",
      },

      // setSelectedCard: (card) =>
      //   set({
      //     selectedCard: {
      //       templateName: card?.templateName || "",
      //       msg: card?.msg || "",
      //       img: card?.img?.url || "",
      //       theirName: card?.theirName || "",
      //       yourName: card?.yourName || "",
      //     },
      //   }),
      resetSelectedCard: () =>
        set({
          selectedCard: { ...emptySelectedCard },
        }),

      setSelectedCard: (partial) =>
  set((state) => ({
    selectedCard: {
      ...state.selectedCard,
      ...partial,
    },
  })),

      product: null,
      setProduct: (prd) => set({ product: prd }),
    }),

    {
      name: "greeting-flow-storage", // key in localStorage
    }
  )
);
