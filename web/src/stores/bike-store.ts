import { create } from "zustand";
import type { BikeDto } from "@app/shared";

type BikesState = {
  bikes: BikeDto[];

  clear: () => void;
  setBikes: (bikes: BikeDto[]) => void;
  upsertBike: (bike: BikeDto) => void;
  removeBike: (id: string) => void;
  getById: (id: string) => BikeDto | undefined;
};

export const useBikesStore = create<BikesState>((set, get) => ({
  bikes: [],

  clear: () => set({ bikes: [] }),

  setBikes: (bikes) => set({ bikes }),

  upsertBike: (bike) => {
    const upsertOneBike = (store: BikesState) => {
      const idx = store.bikes.findIndex(x => x.id === bike.id);
      if (idx === -1) return { bikes: [bike, ...store.bikes] };
      const copy = store.bikes.slice();
      copy[idx] = bike;
      return { bikes: copy };
    };

    set(s => upsertOneBike(s));
  },

  removeBike: (id) => {
      const removeOneBike = (store: BikesState) => {
          const filtered = store.bikes.filter(b => b.id !== id);
          return { bikes: filtered };
      }

      set(s => removeOneBike(s));
  },

  getById: (id) => get().bikes.find((b) => b.id === id)
}));
