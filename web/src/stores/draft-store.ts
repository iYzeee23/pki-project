import { create } from "zustand";
import type { LngLat } from "@app/shared";

type DraftState = {
  editingBikeId: string | null;
  pinColor: L.Icon | null;
  pickedLocation: LngLat | null;

  startPickLocation: (bikeId: string, color: L.Icon, initial: LngLat) => void;
  setPickedLocation: (loc: LngLat) => void;
  stopPickLocation: () => void;
};

export const useDraftStore = create<DraftState>((set) => ({
  editingBikeId: null,
  pickedLocation: null,
  pinColor: null,

  startPickLocation: (bikeId, color, initial) => set({ editingBikeId: bikeId, pinColor: color, pickedLocation: initial }),

  setPickedLocation: (loc) => set({ pickedLocation: loc }),
  
  stopPickLocation: () => set({ editingBikeId: null, pinColor: null, pickedLocation: null }),
}));
