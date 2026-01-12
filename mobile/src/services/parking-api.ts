import { ParkingSpotDto } from "@app/shared";
import { http } from "../util/http";

export async function list() {
    const res = await http.get("/parking-spots");

    const data = res.data as ParkingSpotDto[];
    return data;
}
