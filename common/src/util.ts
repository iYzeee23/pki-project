import { LngLat } from "./types";

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

export function keyOf(location: LngLat) {
  const lng = location.lng;
  const lat = location.lat;

  return `${lng.toFixed(4)},${lat.toFixed(4)}`;
}

export function getCached(cache: Map<string, string>, key: string) {
  const value = cache.get(key);
  if (!value) return undefined;

  return value;
}

export function setCached(cache: Map<string, string>, key: string, label: string) {
  cache.set(key, label);
}
