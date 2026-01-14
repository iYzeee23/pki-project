import { ParkingSpotDto } from "@app/shared";
import { http } from "../util/http";

export async function list(signal?: AbortSignal) {
    const res = await http.get("/parking-spots", { signal: signal });

    const data = res.data as ParkingSpotDto[];
    return data;
}
