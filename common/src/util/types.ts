export const GEOJSON_STRUCTURES = ["Point"] as const;
export type GeoJsonStructure = (typeof GEOJSON_STRUCTURES)[number];

export const BIKE_STATUSES = ["Available", "Busy", "Maintenance", "Off"] as const;
export type BikeStatus = (typeof BIKE_STATUSES)[number];

export const IMAGE_SOURCES = ["Rental", "Issue"] as const;
export type ImageSource = (typeof IMAGE_SOURCES)[number];

export type LngLat = { lng: number; lat: number };
export type LoginRequest = { username: string; password: string };
export type LoginResponse = { token: string };

export const NUM_OF_NEAREST_OBJECTS = 3;
export const PARKING_RADIUS_M = 50;

export const LOCATION_CACHE_SERVER = new Map<string, string>();
export const LOCATION_CACHE_MOBILE = new Map<string, string>();
export const LOCATION_CACHE_WEB = new Map<string, string>();

export const DEFAULT_PROFILE_PICTURE = "/uploads/default-profile-picture.jpg";
export type Draft = Record<string, string | number | Date | null | undefined>;
