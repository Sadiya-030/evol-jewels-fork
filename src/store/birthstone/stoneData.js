import { create } from "zustand";
import { persist } from "zustand/middleware";

const initialStoneData = {
  sunSign: "",
  signDescription: "",
  gemstone: {
    name: "",
    image: "",
    resonance: "",
    properties: "",
  },
  blessing: "",
};

export const useStoneDataStore = create(
  persist(
    (set) => ({
      stoneData: { ...initialStoneData },

      // ✅ set full API response, extract sunSign
      setStoneData: (data) =>
        set({
          stoneData: {
            sunSign: data?.birthDetails?.sunSign || "",
            signDescription: data?.cosmicReading?.signDescription || "",
            gemstone: {
              name: data?.cosmicReading?.gemstone?.name || "",
              image: data?.cosmicReading?.gemstone?.image || "",
              resonance: data?.cosmicReading?.gemstone?.resonance || "",
              properties: data?.cosmicReading?.gemstone?.properties || "",
            },
            blessing: data?.cosmicReading?.blessing || "",
          },
        }),

      // ✅ clear
      clearStoneData: () =>
        set({
          stoneData: { ...initialStoneData },
        }),
    }),
    {
      name: "stoneData-storage",
    }
  )
);
