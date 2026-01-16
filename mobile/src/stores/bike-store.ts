import { BikeDto } from "@app/shared";
import { create } from "zustand";

type BikesState = {
    bikes: BikeDto[];

    clear: () => void;
    setBikes: (bikes: BikeDto[]) => void;
    upsertBike: (bike: BikeDto) => void;  
};

export const useBikesStore = create<BikesState>((set) => ({
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
    }
}));
