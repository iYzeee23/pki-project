import { AxiosInstance } from "axios";
import { UserDto } from "../util/dtos";

export type ChangePasswordPayload = {
    oldPassword: string;
    newPassword: string;
};

export function createProfileApi(http: AxiosInstance) {
    return {
        async updateMe(form: FormData, signal?: AbortSignal) {
            const res = await http.put("/users/me/update", form, {
                signal: signal,
                headers: { "Content-Type": "multipart/form-data" },
            });

            const data = res.data;
            return data as UserDto;
        },

        async changePassword(payload: ChangePasswordPayload, signal?: AbortSignal) {
            await http.put("/users/me/password", payload, { signal: signal });

            const data = "Password changed successfully";
            return data;
        }
    };
}
