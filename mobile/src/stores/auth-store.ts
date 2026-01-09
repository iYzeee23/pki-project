import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import { apiLogin } from "../services/auth-api";

type AuthState = {
  token: string | null;
  isHydrated: boolean;

  hydrate: () => Promise<void>;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const TOKEN_KEY = "jwt_token";

export const useAuthStore = create<AuthState>(set => ({
  token: null,
  isHydrated: false,

  hydrate: async () => {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);

    set({ token: token ?? null, isHydrated: true });
  },

  login: async (username, password) => {
    const payload = {
      username: username,
      password: password
    };

    const { token } = await apiLogin(payload);
    await SecureStore.setItemAsync(TOKEN_KEY, token);

    set({ token });
  },

  logout: async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    
    set({ token: null });
  },
}));
