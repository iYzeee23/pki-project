export const API_BASE_URL = "http://192.168.0.16:3000";

export function resolveImageUrl(path: string) {
    return `${API_BASE_URL}${path}`;
}
