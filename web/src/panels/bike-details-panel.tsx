import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useBikesStore } from "../stores/bike-store";
import { getCached, keyOf, LOCATION_CACHE_WEB, setCached } from "@app/shared";
import { geocodeApi } from "../util/services";
import { Panel } from "./panel";
import { Pressable } from "../main/pressable";

export function BikeDetailsPanel() {
  const { id } = useParams();
  const nav = useNavigate();
  const loc = useLocation();
  const from = loc.state?.from as string | undefined;

  const bike = useBikesStore((s) => s.bikes.find((x) => x.id === id));
  const [addr, setAddr] = useState<string | null>(null);
  const [addrBusy, setAddrBusy] = useState(false);

  const controllerRef = useRef<AbortController | null>(null);

  const locKey = useMemo(() => {
    if (!bike) return null;
    return keyOf(bike.location, "sr-Latn");
  }, [bike]);

  useEffect(() => {
    if (!bike || !locKey) return;

    // cache hit
    const cached = getCached(LOCATION_CACHE_WEB, locKey);
    if (cached) {
      setAddr(cached);
      return;
    }

    controllerRef.current?.abort();
    controllerRef.current = new AbortController();
    const signal = controllerRef.current.signal;

    setAddrBusy(true);
    geocodeApi
      .reverse(bike.location.lng, bike.location.lat, "sr-Latn", signal)
      .then((label) => {
        setCached(LOCATION_CACHE_WEB, locKey, label);
        setAddr(label);
      })
      .catch(() => {
        // ignoriši (npr abort / offline)
      })
      .finally(() => setAddrBusy(false));

    return () => controllerRef.current?.abort();
  }, [bike, locKey]);

  if (!bike) return null;

  return (
    <Panel title="Bicikl" onClose={() => nav("/map")}>
      <div style={{ display: "grid", gap: 10 }}>
        <div><b>Tip:</b> {bike.type}</div>
        <div><b>Status:</b> {bike.status}</div>
        <div><b>Cena/sat:</b> {bike.pricePerHour}</div>
        <div><b>QR:</b> {bike.qrCode}</div>

        <div>
          <b>Koordinate:</b> {bike.location.lat.toFixed(5)}, {bike.location.lng.toFixed(5)}
        </div>

        <div>
          <b>Adresa:</b>{" "}
          {addrBusy ? "Učitavanje..." : addr ?? "—"}
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
          <Pressable type="button" onClick={() => nav(`/map/bike/${bike.id}/edit`)}>
            Izmeni
          </Pressable>

          <Pressable type="button" onClick={() =>(from ? nav(from) : nav("/map"))} variant="secondary">
            Nazad
          </Pressable>
        </div>
      </div>
    </Panel>
  );
}
