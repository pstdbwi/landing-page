// useUserStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";



type TShareLink = {
  shareLink: string;
  setShareLink: (shareLink: string) => void;
};

export const useShareLink = create<TShareLink>()(
  persist(
    (set) => ({
      shareLink: "",
      setShareLink: (shareLink) => set({shareLink}),
    }),
    {
      name: "share-link", // key in localStorage
    }
  )
);
