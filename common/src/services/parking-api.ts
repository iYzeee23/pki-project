import { AxiosInstance } from "axios";
import { ParkingSpotDto } from "../util/dtos";

export function createParkingApi(http: AxiosInstance) {
    return {
        async list(signal?: AbortSignal) {
            const res = await http.get("/parking-spots", { signal: signal });

            const data = res.data as ParkingSpotDto[];
            return data;
        }
    };
}
