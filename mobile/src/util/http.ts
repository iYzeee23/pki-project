import axios from "axios";
import { API_BASE_URL } from "./config";
import { useAuthStore } from "../stores/auth-store";

export const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

http.interceptors.request.use(config => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
