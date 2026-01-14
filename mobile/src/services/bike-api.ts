import { http } from "../util/http";
import { BikeDto } from "@app/shared";

export async function getById(id: string, signal?: AbortSignal) {
  const res = await http.get(`/bikes/${id}`, { signal: signal });

  const data = res.data;
  return data as BikeDto;
}

export async function list(signal?: AbortSignal) {
  const res = await http.get("/bikes/list", { signal: signal });

  const data = res.data as BikeDto[];
  return data;
}
