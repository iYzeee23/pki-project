import axios, { type AxiosInstance } from "axios";

export type CreateHttpOptions = {
    baseURL: string;
    timeoutMs: number;
};

export type HttpClient = AxiosInstance & {
    setAuthToken: (token: string | null) => void;
    setOnUnauthorized: (handler: (() => void) | null) => void;
};

export function createHttp(options: CreateHttpOptions): HttpClient {
    let authToken: string | null = null;
    let onUnauthorized: (() => void) | null = null;

    const http = axios.create({
        baseURL: options.baseURL,
        timeout: options.timeoutMs ?? 15000,
    }) as HttpClient;

    http.setAuthToken = (token) => {
        authToken = token;
    };

    http.setOnUnauthorized = (handler) => {
        onUnauthorized = handler;
    };

    http.interceptors.request.use((config) => {
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
        if (status === 401 && onUnauthorized) onUnauthorized();
        
        if (!isCanceled(err)) {
            console.log(
                "HTTP error:",
                err?.config?.method,
                err?.config?.url,
                err?.response?.status
            );
        }

        return Promise.reject(err);
        }
    );

    return http;
}

export function isCanceled(e: any) {
  return e?.code === "ERR_CANCELED" || e?.name === "CanceledError";
}
