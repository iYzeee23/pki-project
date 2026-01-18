import { create } from "zustand";
import type { BikeStatus, ParkingSpotDto } from "@app/shared";
import { parkingApi } from "../util/services";

type MapState = {
  parkingSpots: ParkingSpotDto[];
  loading: boolean;
  bikeStatusFilter: BikeStatus | "All";

  clear: () => void;
  loadParkingSpots: (signal?: AbortSignal) => Promise<void>;
  setBikeStatusFilter: (filter: BikeStatus | "All") => void;
};

export const useMapStore = create<MapState>((set) => ({
  parkingSpots: [],
  loading: false,
  bikeStatusFilter: "All",

  clear: () => set({ parkingSpots: [], loading: false }),

  loadParkingSpots: async (signal?: AbortSignal) => {
    set({ loading: true });

    const spots = await parkingApi.list(signal);
    set({ parkingSpots: spots, loading: false });
  },

  setBikeStatusFilter: (v) => set({ bikeStatusFilter: v }),
}));
