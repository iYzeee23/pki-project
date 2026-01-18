import { AxiosInstance } from "axios";
import { RentalDto } from "../util/dtos";

export type StartRentalPayload = {
  bikeId: string;
};

export type FinishRentalPayload = {
  description: string;
};

export function createRentalApi(http: AxiosInstance) {
  return {
    async history(signal?: AbortSignal) {
      const res = await http.get("/rentals/history", { signal: signal });

      const data = res.data;
      return data as RentalDto[];
    },

    async getById(id: string, signal?: AbortSignal) {
      const res = await http.get(`/rentals/${id}`, { signal: signal });

      const data = res.data;
      return data as RentalDto;
    },

    async list(signal?: AbortSignal) {
      const res = await http.get("/rentals/admin/list", { signal: signal });

      const data = res.data;
      return data as RentalDto[];
    },

    async active(signal?: AbortSignal) {
      const res = await http.get("/rentals/active", { signal: signal });
      
      const data: RentalDto | undefined = res.data ?? undefined;
      return data;
    },

    async start(payload: StartRentalPayload, signal?: AbortSignal) {
      const res = await http.post("/rentals/start", payload, { signal: signal });

      const data = res.data;
      return data as RentalDto;
    },

    async finish(payload: FinishRentalPayload, signal?: AbortSignal) {
      const res = await http.put("/rentals/finish", payload, { signal: signal });

      const data = res.data;
      return data as RentalDto;
    }
  };
}
