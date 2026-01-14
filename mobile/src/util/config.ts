export const API_BASE_URL = "http://192.168.1.5:3000";

export function resolveImageUrl(path: string) {
    return `${API_BASE_URL}${path}`;
}

export const DEFAULT_PROFILE_PICTURE = "/uploads/default-profile-picture.jpg";

export const DEFAULT_PROFILE_PICTURE_RESOLVED = `${API_BASE_URL}${DEFAULT_PROFILE_PICTURE}`
