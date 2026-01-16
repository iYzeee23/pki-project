import { AxiosInstance } from "axios";

export function createGeocodeApi(http: AxiosInstance) {
  return {
    async reverse(lng: number, lat: number, uiLang: string, signal?: AbortSignal) {
      const res = await http.get("/geocode/reverse", { 
        signal: signal,
        params: { lng: lng, lat: lat, lang: uiLang } 
      });

      const data = res.data;
      return data.label as string;
    }
  };
}
