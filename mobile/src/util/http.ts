import axios from "axios";
import { API_BASE_URL } from "./config";

let authToken: string | null = null;

let onUnauthorized: (() => void) | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
}

export function setOnUnauthorized(handler: (() => void) | null) {
  onUnauthorized = handler;
}

export const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

http.interceptors.request.use(config => {
 if (authToken) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${authToken}`;
  }

  return config;
});

http.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    if (status === 401 && onUnauthorized)
      onUnauthorized();

    console.log("HTTP error:", err?.config?.method, err?.config?.url, err?.response?.status);

    return Promise.reject(err);
  }
);
