import { ParkingSpotDto } from "./dtos";
import { LngLat, NUM_OF_NEAREST_OBJECTS, PARKING_RADIUS_M } from "./types";

export function haversineMeters(bike: LngLat, spot: LngLat): number {
  const R = 6371000;
  const toRad = (x: number) => (x * Math.PI) / 180;

  const dLat = toRad(spot.lat - bike.lat);
  const sinDLat = Math.sin(dLat / 2);

  const dLng = toRad(spot.lng - bike.lng);
  const sinDLng = Math.sin(dLng / 2);

  const latBike = toRad(bike.lat);
  const cosLatBike = Math.cos(latBike);

  const latSpot = toRad(spot.lat);
  const cosLatSpot = Math.cos(latSpot);
  
  const h = (sinDLat * sinDLat) + (cosLatBike * cosLatSpot * sinDLng * sinDLng);
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

export function keyOf(location: LngLat, language: string) {
  const lng = location.lng;
  const lat = location.lat;

  return `${lng.toFixed(4)},${lat.toFixed(4)},${language}}`;
}

export function getCached(cache: Map<string, string>, key: string) {
  const value = cache.get(key);
  if (!value) return undefined;

  return value;
}

export function setCached(cache: Map<string, string>, key: string, label: string) {
  cache.set(key, label);
}

export function isoDateOnly(iso: string) {
  return iso.slice(0, 10);
}

export function formatDateTime(iso: string) {
  const date = new Date(iso);
  return date.toLocaleString();
}

export function formatDurationFromMs(ms: number) {
  const totalSec = Math.floor(ms / 1000);

  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;

  const hh = String(h).padStart(2, "0");
  const mm = String(m).padStart(2, "0");
  const ss = String(s).padStart(2, "0");
  
  return `${hh}:${mm}:${ss}`;
}

export function formatDurationFromStartEnd(startIso: string, endIso: string) {
  const start = new Date(startIso).getTime();
  const end = new Date(endIso).getTime();

  const milliSeconds = end - start;
  const totalMinutes = Math.floor(milliSeconds / (60 * 1000));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const hh = String(hours).padStart(2, "0");
  const mm = String(minutes).padStart(2, "0");
  return `${hh}:${mm}`;
}

export function findInsideSpotId(bikeLoc: LngLat, spots: ParkingSpotDto[]) {
  for (const s of spots) {
    const d = haversineMeters(bikeLoc, s.location);
    if (d <= PARKING_RADIUS_M) return s.id;
  }

  return undefined;
}

export function nearestSpots(spots: ParkingSpotDto[], location: LngLat) {
  return spots
    .map(s => ({ spot: s, distance: haversineMeters(location, s.location) }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, NUM_OF_NEAREST_OBJECTS);
}

export function resolveImageUrl(baseUrl: string, path: string) {
    return `${baseUrl}${path}`;
}
