import { AxiosInstance } from "axios";
import { BikeDto } from "../util/dtos";
import { BikeStatus, LngLat } from "../util/types";

export type BikeUpsertPayload = {
  type: string;
  pricePerHour: number;
  status: BikeStatus;
  location: LngLat;
};

export function createBikeApi(http: AxiosInstance) {
  return {
    async getById(id: string, signal?: AbortSignal) {
      const res = await http.get(`/bikes/${id}`, { signal: signal });

      const data = res.data;
      return data as BikeDto;
    },

    async list(signal?: AbortSignal) {
      const res = await http.get("/bikes/list", { signal: signal });

      const data = res.data;
      return data as BikeDto[];
    },

    async create(payload: BikeUpsertPayload, signal?: AbortSignal) {
      const res = await http.post("/bikes/new", payload, { signal });

      const data =  res.data;
      return data as BikeDto;
    },

    async update(id: string, payload: BikeUpsertPayload, signal?: AbortSignal) {
      const res = await http.put(`/bikes/${id}`, payload, { signal });

      const data = res.data;
      return data as BikeDto;
    },

    async updateLocation(id: string, location: LngLat, signal?: AbortSignal) {
      const res = await http.put(`/bikes/${id}/location`, { location }, { signal });

      const data = res.data;
      return data as BikeDto;
    },

    async changeStatus(id: string, status: BikeStatus, signal?: AbortSignal) {
      const res = await http.put(`/bikes/${id}/status`, { status }, { signal });

      const data = res.data;
      return data as BikeDto;
    },

    async remove(id: string, signal?: AbortSignal) {
      const res = await http.delete(`/bikes/${id}`, { signal });

      const data = res.data;
      return data as { ok: true };
    }
  };
}
