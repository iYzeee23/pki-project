import { createHttp } from "@app/shared";
import { VITE_API_BASE_URL } from "./config";
import axios from "axios";

export const http = createHttp({
  baseURL: VITE_API_BASE_URL,
  timeoutMs: 15000
});

export const setAuthToken = http.setAuthToken;
export const setOnUnauthorized = http.setOnUnauthorized;

export function getApiErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data;
    return data?.error ?? err.message ?? "Unexpected error";
  }
  
  return err instanceof Error ? err.message : "Unexpected error";
}
