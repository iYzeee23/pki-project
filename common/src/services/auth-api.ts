import { AxiosInstance } from "axios";
import { UserDto } from "../util/dtos";

export type LoginPayload = {
  username: string;
  password: string;
};

export type AuthResponse = {
  token: string;
  user: UserDto;
};

export function createAuthApi(http: AxiosInstance) {
  return {
    async login(payload: LoginPayload, signal?: AbortSignal) {
      const res = await http.post("/users/login", payload, { signal });

      const data = res.data;
      if (!data) return undefined;

      return { token: data.token, user: data.user } as AuthResponse;
    },

    async register(form: FormData, signal?: AbortSignal) {
      const res = await http.post("/users/register", form, {
        signal: signal,
        headers: { "Content-Type": "multipart/form-data" },
      });

      const data = res.data;
      return { token: data.token, user: data.user } as AuthResponse;
    },
  };
}
