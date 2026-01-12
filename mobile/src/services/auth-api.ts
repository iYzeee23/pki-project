import { http } from "../util/http";
import { UserDto } from "@app/shared";

export type RegisterPayload = {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  file?: { uri: string; name: string; type: string };
};

export type LoginPayload = {
  username: string;
  password: string;
};

export type AuthResponse = {
  token: string;
  user: UserDto;
};

export async function register(payload: RegisterPayload) {
  const form = new FormData();

  form.append("username", payload.username);
  form.append("password", payload.password);
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
  
  const res = await http.post("/users/register", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  const data = res.data;
  return { token: data.token, user: data.user } as AuthResponse;
}

export async function login(payload: LoginPayload) {
  const res = await http.post("/users/login", payload);
  
  const data = res.data;
  if (!data) return undefined;
  
  return { token: data.token, user: data.user } as AuthResponse;
}
