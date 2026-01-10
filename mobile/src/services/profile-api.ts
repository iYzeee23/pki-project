import { http } from "../util/http";
import { UserDto } from "@app/shared";

export type UpdateMePayload = {
    username: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    file?: { uri: string; name: string; type: string };
};

export type ChangePasswordPayload = {
    oldPassword: string;
    newPassword: string;
};

export async function getMe() {
    const res = await http.get("/users/me");

    const data = res.data;
    return data as UserDto;
}

export async function updateMe(payload: UpdateMePayload) {
    const form = new FormData();

    form.append("username", payload.username);
    form.append("firstName", payload.firstName);
    form.append("lastName", payload.lastName);
    form.append("phone", payload.phone);
    form.append("email", payload.email);

    if (payload.file) {
        form.append("file", {
            uri: payload.file.uri,
            name: payload.file.name,
            type: payload.file.type,
        } as any);        
    }

    const res = await http.put("/users/me/update", form, {
        headers: { "Content-Type": "multipart/form-data" },
    });

    const data = res.data;
    return data as UserDto;
}

export async function changePassword(payload: ChangePasswordPayload) {
    await http.put("/users/me/password", payload);

    const data = "Password changed successfully";
    return data;
}
