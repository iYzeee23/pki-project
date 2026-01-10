import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import * as authApi from "../services/auth-api";
import { UserDto } from "@app/shared";
import { setAuthToken } from "../util/http";

type AuthState = {
  token: string | null;
  isHydrated: boolean;
  me: UserDto | null;

  setMe: (me: UserDto | null) => void;
  setSession: (payload: any) => Promise<void>;
  hydrate: () => Promise<void>;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  isHydrated: false,
  me: null,

  setMe: async (updated) => {
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(updated));

    set({ me: updated });
  },

  setSession: async (payload) => {
    await SecureStore.setItemAsync(TOKEN_KEY, payload.token);
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(payload.user));

    setAuthToken(payload.token);
    get().setMe(payload.user);
    set({ token: payload.token });
  },

  hydrate: async () => {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    const userJson = await SecureStore.getItemAsync(USER_KEY);
    const me = userJson ? (JSON.parse(userJson) as UserDto) : null;

    setAuthToken(token);
    get().setMe(me);
    set({ token: token, isHydrated: true });
  },

  login: async (username, password) => {
    const payload = {
      username: username,
      password: password
    };

    const response = await authApi.login(payload);
    await get().setSession(response);
  },

  logout: async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(USER_KEY);
    
    setAuthToken(null);
    get().setMe(null);
    set({ token: null });
  },
}));
