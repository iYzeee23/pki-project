import { useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useMapStore } from "../stores/map-store";
import { useBikesStore } from "../stores/bike-store";
import { haversineMeters, PARKING_RADIUS_M } from "@app/shared";
import { Panel } from "./panel";
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

  return (
    <Panel title={`${pdp.Parking}: ${spot.name}`} onClose={() => nav("/map")}>
      <div style={{ display: "grid", gap: 10 }}>
        <div>
          <b>{pdp.Coordinates}:</b> {spot.location.lat.toFixed(5)}, {spot.location.lng.toFixed(5)}
        </div>

        <div style={{ fontWeight: 900, marginTop: 6 }}>{pdp.Bikes}</div>

        {bikesHere.length === 0 ? <div>{pdp.NoBikes}</div> : null}

        {bikesHere.map((b) => (
          <Pressable
            key={b.id}
            onClick={() => nav(`/map/bike/${b.id}`, { state: { from: loc.pathname } })}
            style={{
              textAlign: "left",
              padding: 10,
              borderRadius: 12,
              border: "1px solid #e5e5e5",
              background: "#fff",
              cursor: "pointer",
              color: "#111"
            }}
          >
            <div style={{ fontWeight: 900 }}>{b.type}</div>
            <div style={{ opacity: 0.7 }}>{b.status}</div>
          </Pressable>
        ))}
      </div>
    </Panel>
  );
}
