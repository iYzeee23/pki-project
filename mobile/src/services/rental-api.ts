import { http } from "../util/http";
import { RentalDto } from "@app/shared";

export async function history() {
  const res = await http.get("/rentals/history");

  const data = res.data;
  return data as RentalDto[];
}

export async function getById(id: string) {
  const res = await http.get(`/rentals/${id}`);

  const data = res.data;
  return data as RentalDto;
}

export async function active() {
  const res = await http.get("/rentals/active");

  const data: RentalDto | undefined = res.data ?? undefined;
  return data;
}
