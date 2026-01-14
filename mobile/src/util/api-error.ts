import axios from "axios";

export function getApiErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data;
    return data?.error ?? err.message ?? "Unexpected error";
  }
  
  return err instanceof Error ? err.message : "Unexpected error";
}

export function isCanceled(e: any) {
  return e?.code === "ERR_CANCELED" || e?.name === "CanceledError";
}
