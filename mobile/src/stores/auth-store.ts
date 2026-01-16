import { create } from "zustand";
import { setAuthToken, setOnUnauthorized } from "../util/http";
import { useMapStore } from "./map-store";
import { useBikesStore } from "./bike-store";
import * as SecureStore from "expo-secure-store";
import { authApi } from "../util/services";
import { UserDto } from "@app/shared";

type AuthState = {
  token: string | null;
  isHydrated: boolean;
  me: UserDto | null;

  setMe: (me: UserDto | null) => Promise<void>;
  setSession: (payload: any) => Promise<void>;
  hydrate: () => Promise<void>;
  login: (username: string, password: string, signal?: AbortSignal) => Promise<void>;
  logout: () => Promise<void>;
};

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

let unauthorizedInProgress = false;

export const useAuthStore = create<AuthState>((set, get) => {
  const clearSessionLocal = async () => {
    setAuthToken(null);
    setOnUnauthorized(null);

    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(USER_KEY);

    useMapStore.getState().clear();
    useBikesStore.getState().clear();

    await get().setMe(null);
    set({ token: null });
  };

  const attachUnauthorizedHandler = () => {
    setOnUnauthorized(async () => {
      if (unauthorizedInProgress) return;
      unauthorizedInProgress = true;

      try {
        await clearSessionLocal();
      }
      finally {
        unauthorizedInProgress = false;
      }
    });
  };

  return {
    token: null,
    isHydrated: false,
    me: null,

    setMe: async (updated) => {
      if (updated) await SecureStore.setItemAsync(USER_KEY, JSON.stringify(updated));
      else await SecureStore.deleteItemAsync(USER_KEY);

      set({ me: updated });
    },

    setSession: async (payload) => {
      setAuthToken(payload.token);
      attachUnauthorizedHandler();

      await SecureStore.setItemAsync(TOKEN_KEY, payload.token);
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(payload.user));
      await useMapStore.getState().loadParkingSpots();
      
      await get().setMe(payload.user);
      set({ token: payload.token });
    },

    hydrate: async () => {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      const userJson = await SecureStore.getItemAsync(USER_KEY);
      const me = userJson ? (JSON.parse(userJson) as UserDto) : null;

      setAuthToken(token);
      if (token) attachUnauthorizedHandler();
      else setOnUnauthorized(null);

      await get().setMe(me);
      set({ token: token, isHydrated: true });
    },

    login: async (username, password, signal?: AbortSignal) => {
      const payload = {
        username: username,
        password: password
      };

      const resp = await authApi.login(payload, signal);
      if (!resp) throw new Error("Login failed");

      await get().setSession(resp);
    },

    logout: async () => {
      await clearSessionLocal();
    }
  };
});
