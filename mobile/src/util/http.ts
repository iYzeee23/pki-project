import { createHttp } from "@app/shared";
import { EXPO_API_BASE_URL } from "./config";
import { commonTexts } from "./i18n-builder";
import axios from "axios";

export const http = createHttp({
  baseURL: EXPO_API_BASE_URL,
  timeoutMs: 15000
});

export const setAuthToken = http.setAuthToken;
export const setOnUnauthorized = http.setOnUnauthorized;

export function getApiErrorMessage(err: unknown): string {
  const com = commonTexts();

  if (axios.isAxiosError(err)) {
    const data = err.response?.data;
    return data?.error ?? err.message ?? com.UnexpectedError;
  }
  
  return err instanceof Error ? err.message : com.UnexpectedError;
}
