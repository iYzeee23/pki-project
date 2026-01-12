import { create } from "zustand";
import * as parkingApi from "../services/parking-api";
import { ParkingSpotDto } from "@app/shared";

type MapState = {
    parkingSpots: ParkingSpotDto[];

    clear: () => void;
    loadParkingSpots: () => Promise<void>;
};

export const useMapStore = create<MapState>((set) => ({
    parkingSpots: [],

    clear: () => set({ parkingSpots: [] }),

    loadParkingSpots: async () => {
        const spots = await parkingApi.list();
        set({ parkingSpots: spots });
    }
}));
