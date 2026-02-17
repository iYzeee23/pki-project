import { create } from "zustand";
import type { UserDto } from "@app/shared";
import { setAuthToken, setOnUnauthorized } from "../util/http";
import { authApi } from "../util/services";
import { useMapStore } from "./map-store";
import { useBikesStore } from "./bike-store";

type AuthState = {
  token: string | null;
  isHydrated: boolean;
  me: UserDto | null;

  setMe: (me: UserDto | null) => void;
  setSession: (payload: { token: string; user: UserDto }) => Promise<void>;
  hydrate: () => Promise<void>;
  login: (username: string, password: string, signal?: AbortSignal) => Promise<void>;
  logout: () => void;
};

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

let unauthorizedInProgress = false;

export const useAuthStore = create<AuthState>((set, get) => {
  const clearSessionLocal = () => {
    setAuthToken(null);
    setOnUnauthorized(null);

    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);

    useMapStore.getState().clear();
    useBikesStore.getState().clear();

    get().setMe(null);
    set({ token: null });
  };

  const attachUnauthorizedHandler = () => {
    setOnUnauthorized(() => {
      if (unauthorizedInProgress) return;
      unauthorizedInProgress = true;

      try {
        clearSessionLocal();
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

    setMe: (updated) => {
      if (updated) localStorage.setItem(USER_KEY, JSON.stringify(updated));
      else localStorage.removeItem(USER_KEY);

      set({ me: updated });
    },

    setSession: async (payload) => {
      if (!payload.user.isAdmin)
        throw new Error("This account doesn't have admin permissions");

      setAuthToken(payload.token);
      attachUnauthorizedHandler();

      localStorage.setItem(TOKEN_KEY, payload.token);
      localStorage.setItem(USER_KEY, JSON.stringify(payload.user));
      await useMapStore.getState().loadParkingSpots();

      get().setMe(payload.user);
      set({ token: payload.token });
    },

    hydrate: async () => {
      const token = localStorage.getItem(TOKEN_KEY);
      const userJson = localStorage.getItem(USER_KEY);
      const me = userJson ? (JSON.parse(userJson) as UserDto) : null;

      setAuthToken(token);
      if (token) attachUnauthorizedHandler();
      else setOnUnauthorized(null);

      get().setMe(me);
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

    logout: () => {
      clearSessionLocal();
    }
  };
});
