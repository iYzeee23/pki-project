import { useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useMapStore } from "../stores/map-store";
import { useBikesStore } from "../stores/bike-store";
import { haversineMeters, PARKING_RADIUS_M } from "@app/shared";
import type { BikeStatus } from "@app/shared";
import { Panel } from "./panel";

const STATUS_BG: Record<BikeStatus, string> = {
  Available: "rgba(46, 125, 50, 0.12)",
  Busy: "rgba(211, 47, 47, 0.12)",
  Maintenance: "rgba(249, 168, 37, 0.12)",
  Off: "rgba(117, 117, 117, 0.12)",
};
import { Pressable } from "../elements/pressable";
import { useTranslation } from "react-i18next";
import { parkingTexts } from "../i18n/i18n-builder";

export function ParkingDetailsPanel() {
  const { t } = useTranslation();
  const pdp = parkingTexts(t);

  const { id } = useParams();
  const nav = useNavigate();
  const loc = useLocation();

  const spot = useMapStore((s) => s.parkingSpots.find((x) => x.id === id));
  const bikeStatusFilter = useMapStore(s => s.bikeStatusFilter);
  const bikes = useBikesStore((s) => s.bikes);

  const bikesHere = useMemo(() => {
    if (!spot) return [];
    
    const filtered = bikes.filter((b) => haversineMeters(b.location, spot.location) <= PARKING_RADIUS_M);
    if (bikeStatusFilter == "All") return filtered;

    return filtered.filter(b => b.status == bikeStatusFilter);
  }, [bikeStatusFilter, bikes, spot]);

  if (!spot) return null;

  const infoCardStyle: React.CSSProperties = {
    border: "1px solid #ddd",
    borderRadius: 10,
    padding: "12px 14px",
    display: "flex",
    flexDirection: "column",
    gap: 4,
    fontSize: 14,
  };

  return (
    <Panel title={`${pdp.Parking}: ${spot.name}`} onClose={() => nav("/map")}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={infoCardStyle}>
          <div><b>ID:</b> {spot.id}</div>
          <div><b>{pdp.Latitude}:</b> {spot.location.lat}</div>
          <div><b>{pdp.Longitude}:</b> {spot.location.lng}</div>
        </div>

        <div style={{ fontWeight: 700, fontSize: 15 }}>{pdp.Bikes}</div>

        {bikesHere.length === 0 ? (
          <div style={{ color: "#888", fontSize: 14 }}>{pdp.NoBikes}</div>
        ) : null}

        {bikesHere.map((b) => (
          <Pressable
            key={b.id}
            onClick={() => nav(`/map/bike/${b.id}`, { state: { from: loc.pathname } })}
            style={{
              textAlign: "left",
              padding: "12px 14px",
              borderRadius: 10,
              border: "1px solid #ddd",
              background: STATUS_BG[b.status as BikeStatus] ?? "#fff",
              cursor: "pointer",
              color: "#111",
              display: "flex",
              flexDirection: "column",
              gap: 4,
              fontSize: 14,
            }}
          >
            <div><b>{pdp.Bike}:</b> {b.id}</div>
            <div><b>{pdp.Status}:</b> {b.status}</div>
            <div><b>{pdp.Type}:</b> {b.type}</div>
          </Pressable>
        ))}
      </div>
    </Panel>
  );
}
