import { create } from "zustand";
import { parkingApi } from "../util/services";
import { ParkingSpotDto } from "@app/shared";

type MapState = {
    parkingSpots: ParkingSpotDto[];
    dirty: boolean;

    clear: () => void;
    loadParkingSpots: (signal?: AbortSignal) => Promise<void>;
    markDirty: () => void;
    clearDirty: () => void;
};

export const useMapStore = create<MapState>((set) => ({
    parkingSpots: [],
    dirty: true,

    clear: () => set({ parkingSpots: [] }),

    loadParkingSpots: async (signal?: AbortSignal) => {
        const spots = await parkingApi.list(signal);
        set({ parkingSpots: spots });
    },

    markDirty: () => set({ dirty: true }),

    clearDirty: () => set({ dirty: false })
}));
