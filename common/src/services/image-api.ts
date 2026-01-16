import { AxiosInstance } from "axios";
import { ImageDto } from "../util/dtos";


export function createImageApi(http: AxiosInstance) {
    return {
        async upload(form: FormData, signal?: AbortSignal) {
            const res = await http.post("/images/upload", form, {
                signal: signal,
                headers: { "Content-Type": "multipart/form-data" },
            });

            const data = res.data;
            return data as ImageDto[];
        }
    };
}
