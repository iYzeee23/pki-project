import { useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useMapStore } from "../stores/map-store";
import { useBikesStore } from "../stores/bike-store";
import { haversineMeters, PARKING_RADIUS_M } from "@app/shared";
import { Panel } from "./panel";

export function ParkingDetailsPanel() {
  const { id } = useParams();
  const nav = useNavigate();
  const loc = useLocation();

  const spot = useMapStore((s) => s.parkingSpots.find((x) => x.id === id));
  const bikes = useBikesStore((s) => s.bikes);

  const bikesHere = useMemo(() => {
    if (!spot) return [];
    return bikes.filter((b) => haversineMeters(b.location, spot.location) <= PARKING_RADIUS_M);
  }, [bikes, spot]);

  if (!spot) return null;

  return (
    <Panel title={`Parking: ${spot.name}`} onClose={() => nav("/map")}>
      <div style={{ display: "grid", gap: 10 }}>
        <div>
          <b>Koordinate:</b> {spot.location.lat.toFixed(5)}, {spot.location.lng.toFixed(5)}
        </div>

        <div style={{ fontWeight: 900, marginTop: 6 }}>Bicikli na parkingu</div>

        {bikesHere.length === 0 ? <div>Nema bicikala.</div> : null}

        {bikesHere.map((b) => (
          <button
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
          </button>
        ))}
      </div>
    </Panel>
  );
}
