import { create } from "zustand";
import type { ParkingSpotDto } from "@app/shared";
import { parkingApi } from "../util/services";

type MapState = {
  parkingSpots: ParkingSpotDto[];
  loading: boolean;

  clear: () => void;
  loadParkingSpots: (signal?: AbortSignal) => Promise<void>;
};

export const useMapStore = create<MapState>((set) => ({
  parkingSpots: [],
  loading: false,

  clear: () => set({ parkingSpots: [], loading: false }),

  loadParkingSpots: async (signal?: AbortSignal) => {
    set({ loading: true });

    const spots = await parkingApi.list(signal);
    set({ parkingSpots: spots, loading: false });
  }
}));
