import { create } from "zustand";
import { rentalApi } from "../util/services";
import { RentalDto } from "@app/shared";

type RentalState = {
  activeRental: RentalDto | undefined;
  loadingActive: boolean;

  setActiveRental: (r: RentalDto | undefined) => void;
  refreshActiveRental: (signal?: AbortSignal) => Promise<void>;
  clear: () => void;
};

export const useRentalStore = create<RentalState>((set, get) => ({
  activeRental: undefined,
  loadingActive: false,

  clear: () => set({ activeRental: undefined, loadingActive: false }),

  setActiveRental: (r) => set({ activeRental: r }),

  refreshActiveRental: async (signal?: AbortSignal) => {
    set({ loadingActive: true });

    try {
      const rental = await rentalApi.active(signal);
      get().setActiveRental(rental);
    } 
    finally {
      set({ loadingActive: false });
    }
  }
}));
