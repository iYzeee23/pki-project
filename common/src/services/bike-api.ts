import { AxiosInstance } from "axios";
import { BikeDto } from "../util/dtos";

export function createBikeApi(http: AxiosInstance) {
  return {
    async getById(id: string, signal?: AbortSignal) {
      const res = await http.get(`/bikes/${id}`, { signal: signal });

      const data = res.data;
      return data as BikeDto;
    },

    async list(signal?: AbortSignal) {
      const res = await http.get("/bikes/list", { signal: signal });

      const data = res.data as BikeDto[];
      return data;
    }
  };
}
