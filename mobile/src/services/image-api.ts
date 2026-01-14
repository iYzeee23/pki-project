import { http } from "../util/http";
import { ImageDto, ImageSource } from "@app/shared";

export type UploadImagePayload = {
    ownerId: string;
    ownerModel: ImageSource;
    files: { uri: string; name: string; type: string }[];
};

export async function upload(payload: UploadImagePayload, signal?: AbortSignal) {
    const form = new FormData();

    form.append("ownerId", payload.ownerId);
    form.append("ownerModel", payload.ownerModel);

    for (const file of payload.files) {
        form.append("files", {
            uri: file.uri,
            name: file.name,
            type: file.type,
        } as any);
    }

    const res = await http.post("/images/upload", form, {
        signal: signal,
        headers: { "Content-Type": "multipart/form-data" },
    });

    const data = res.data;
    return data as ImageDto[];
}
