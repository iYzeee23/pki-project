import { http } from "../util/http";
import { BikeDto } from "@app/shared";

export async function getById(id: string) {
  const res = await http.get(`/bikes/${id}`);

  const data = res.data;
  return data as BikeDto;
}
