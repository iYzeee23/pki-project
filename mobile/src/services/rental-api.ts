import { http } from "../util/http";
import { RentalDto } from "@app/shared";

export type StartRentalPayload = {
  bikeId: string;
};

export type FinishRentalPayload = {
  description: string;
};

export async function history(signal?: AbortSignal) {
  const res = await http.get("/rentals/history", { signal: signal });

  const data = res.data;
  return data as RentalDto[];
}

export async function getById(id: string, signal?: AbortSignal) {
  const res = await http.get(`/rentals/${id}`, { signal: signal });

  const data = res.data;
  return data as RentalDto;
}

export async function active(signal?: AbortSignal) {
  const res = await http.get("/rentals/active", { signal: signal });
  
  const data: RentalDto | undefined = res.data ?? undefined;
  return data;
}

export async function start(payload: StartRentalPayload, signal?: AbortSignal) {
  const res = await http.post("/rentals/start", payload, { signal: signal });

  const data = res.data;
  return data as RentalDto;
}

export async function finish(payload: FinishRentalPayload, signal?: AbortSignal) {
  const res = await http.put("/rentals/finish", payload, { signal: signal });

  const data = res.data;
  return data as RentalDto;
}
