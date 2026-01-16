import { create } from "zustand";

export type DraftFlow = {
  bikeId: string;
  description: string;
};

type DraftState = {
  draft: DraftFlow | undefined;

  setDraft: (d: DraftFlow) => void;
  clearDraft: () => void;
};

export const useDraftStore = create<DraftState>((set) => ({
  draft: undefined,

  setDraft: (d) => set({ draft: d }),

  clearDraft: () => set({ draft: undefined }),
}));
