import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getCached, keyOf, LOCATION_CACHE_WEB, setCached, type BikeStatus } from "@app/shared";
import { QRCodeCanvas } from "qrcode.react";
import { useBikesStore } from "../../stores/bike-store";
import { geocodeApi } from "../../util/services";
import { Panel } from "../panel";
import { Pressable } from "../../elements/pressable";
import { useTranslation } from "react-i18next";
import { bikeDetailsTexts } from "../../i18n/i18n-builder";

const STATUS_BG: Record<BikeStatus, string> = {
  Available: "rgba(46, 125, 50, 0.12)",
  Busy: "rgba(211, 47, 47, 0.12)",
  Maintenance: "rgba(249, 168, 37, 0.12)",
  Off: "rgba(117, 117, 117, 0.12)",
};

export function BikeDetailsPanel() {
  const { t } = useTranslation();
  const bdp = bikeDetailsTexts(t);

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
    return keyOf(bike.location, bdp.Language);
  }, [bike]);

  useEffect(() => {
    if (!bike || !locKey) return;

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
      .reverse(bike.location.lng, bike.location.lat, bdp.Language, signal)
      .then((label) => {
        setCached(LOCATION_CACHE_WEB, locKey, label);
        setAddr(label);
      })
      .catch(() => {})
      .finally(() => setAddrBusy(false));

    return () => controllerRef.current?.abort();
  }, [bike, locKey]);

  if (!bike) return null;

  return (
    <Panel title={bdp.BikeDetails} onClose={() => nav(from ?? "/map")}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Info card */}
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: 10,
            padding: "14px 16px",
            display: "flex",
            flexDirection: "column",
            gap: 5,
            fontSize: 14,
            background: STATUS_BG[bike.status as BikeStatus] ?? "#fff",
          }}
        >
          <div><b>{bdp.Type}:</b> {bike.type}</div>
          <div><b>{bdp.Status}:</b> {bike.status}</div>
          <div><b>{bdp.Price}:</b> {bike.pricePerHour}</div>
          <div><b>{bdp.ID}:</b> {bike.id}</div>
          <div><b>{bdp.Address}:</b> {addrBusy ? bdp.Loading : addr ?? "—"}</div>
          <div><b>{bdp.Latitude}:</b> {bike.location.lat}</div>
          <div><b>{bdp.Longitude}:</b> {bike.location.lng}</div>
        </div>

        {/* QR Code */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <QRCodeCanvas value={bike.id} size={140} />
          <span style={{ fontSize: 13, color: "#555" }}>{bdp.QRCode}</span>
        </div>

        {/* Edit button */}
        <Pressable
          type="button"
          onClick={() => nav(`/map/bike/${bike.id}/edit`)}
          style={{
            backgroundColor: "#2E7D32",
            color: "#fff",
            border: "none",
            borderRadius: 12,
            padding: "14px 0",
            fontWeight: 700,
            fontSize: 15,
            textAlign: "center",
            cursor: "pointer",
          }}
        >
          {bdp.Edit}
        </Pressable>
      </div>
    </Panel>
  );
}
