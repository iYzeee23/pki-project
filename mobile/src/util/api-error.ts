import axios from "axios";
import { commonTexts } from "../util/i18n-builder"

export function getApiErrorMessage(err: unknown): string {
  const com = commonTexts();

  if (axios.isAxiosError(err)) {
    const data = err.response?.data;
    return data?.error ?? err.message ?? com.UnexpectedError;
  }
  
  return err instanceof Error ? err.message : com.UnexpectedError;
}

export function isCanceled(e: any) {
  return e?.code === "ERR_CANCELED" || e?.name === "CanceledError";
}
