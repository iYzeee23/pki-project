import { http } from "../util/http";

export async function reverse(lng: number, lat: number, signal?: AbortSignal) {
  const res = await http.get("/geocode/reverse", { 
    signal: signal,
    params: { lng: lng, lat: lat } 
  });

  const data = res.data;
  return data.label as string;
}
