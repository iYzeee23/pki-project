import { AxiosInstance } from "axios";
import { ImageDto } from "../util/dtos";
import { ImageSource } from "../util/types";


export function createImageApi(http: AxiosInstance) {
    return {
        async upload(form: FormData, signal?: AbortSignal) {
            const res = await http.post("/images/upload", form, {
                signal: signal,
                headers: { "Content-Type": "multipart/form-data" },
            });

            const data = res.data;
            return data as ImageDto[];
        },

        async fetch(model: ImageSource, id: string, signal?: AbortSignal) {
            const res = await http.get(`/images/fetch/${model}/${id}`, { signal: signal });

            const data = res.data;
            return data as ImageDto[];
        }
    };
}
