import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BIKE_STATUSES, type BikeDto, type BikeStatus, type LngLat } from "@app/shared";
import { useBikesStore } from "../../stores/bike-store";
import { useDraftStore } from "../../stores/draft-store";
import { bikeApi } from "../../util/services";
import { bikeAvailableIcon, bikeBusyIcon, bikeOtherIcon } from "../../util/pin-colors";
import { Panel } from "../panel";
import { TextField } from "../../elements/text-field";
import { SelectField } from "../../elements/select-field";
import { Pressable } from "../../elements/pressable";
import { useTranslation } from "react-i18next";
import { bikeEditTexts } from "../../i18n/i18n-builder";

const NEW_BIKE_DRAFT_ID = "__new_bike__";

export function BikeAddPanel() {
  const { t } = useTranslation();
  const bep = bikeEditTexts(t);

  const nav = useNavigate();

  const upsertBike = useBikesStore(s => s.upsertBike);

  const editingBikeId = useDraftStore(s => s.editingBikeId);
  const pickedLocation = useDraftStore(s => s.pickedLocation);
  const startPickLocation = useDraftStore(s => s.startPickLocation);
  const stopPickLocation = useDraftStore(s => s.stopPickLocation);

  const [type, setType] = useState("");
  const [pricePerHour, setPricePerHour] = useState("");
  const [status, setStatus] = useState<BikeStatus>("Available");
  const [location, setLocation] = useState<LngLat | null>(null);
  const [busy, setBusy] = useState(false);

  const saveCtrl = useRef<AbortController | null>(null);

  const effectiveLoc = useMemo(() => {
    if (editingBikeId === NEW_BIKE_DRAFT_ID && pickedLocation) return pickedLocation;
    return location;
  }, [editingBikeId, pickedLocation, location]);

  const onClose = () => {
    stopPickLocation();
    nav("/map");
  };

  const onStartPick = () => {
    const pinColor =
      status === "Available"
        ? bikeAvailableIcon
        : status === "Busy"
        ? bikeBusyIcon
        : bikeOtherIcon;

    const defaultCenter = { lat: 44.80796, lng: 20.44864 };
    startPickLocation(NEW_BIKE_DRAFT_ID, pinColor, effectiveLoc ?? defaultCenter);
  };

  const onFinishPick = () => {
    if (pickedLocation) setLocation(pickedLocation);
    stopPickLocation();
  };

  const onCancelPick = () => {
    stopPickLocation();
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const pph = Number(pricePerHour);
    if (!type.trim()) return alert(bep.ErrBikeType);
    if (!Number.isFinite(pph) || pph <= 0) return alert(bep.ErrPrice);
    if (!effectiveLoc) return alert(bep.ErrLocation);

    saveCtrl.current?.abort();
    saveCtrl.current = new AbortController();
    const signal = saveCtrl.current.signal;

    setBusy(true);
    try {
      const created: BikeDto = await bikeApi.create(
        {
          type: type.trim(),
          pricePerHour: pph,
          status,
          location: effectiveLoc,
        },
        signal
      );

      upsertBike(created);
      stopPickLocation();
      nav(`/map/bike/${created.id}`);
    } catch (err: any) {
      alert(err?.message ?? bep.ErrSaving);
    } finally {
      setBusy(false);
    }
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 13,
    fontWeight: 600,
    color: "#2E7D32",
    marginBottom: 2,
  };

  const isPicking = editingBikeId === NEW_BIKE_DRAFT_ID;

  return (
    <Panel title={bep.BikeAdd} onClose={onClose} noBackdrop={isPicking}>
      <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, opacity: isPicking ? 0.5 : 1 }}>
          <span style={labelStyle}>{bep.Type}</span>
          <TextField value={type} onChange={(e) => setType(e.target.value)} disabled={isPicking} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 4, opacity: isPicking ? 0.5 : 1 }}>
          <span style={labelStyle}>{bep.Price}</span>
          <TextField
            value={pricePerHour}
            onChange={(e) => setPricePerHour(e.target.value)}
            inputMode="numeric"
            disabled={isPicking}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 4, opacity: isPicking ? 0.5 : 1 }}>
          <span style={labelStyle}>{bep.Status}</span>
          <SelectField value={status} onChange={(e) => setStatus(e.target.value as BikeStatus)} disabled={isPicking}>
            {BIKE_STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </SelectField>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={labelStyle}>{bep.Location}</span>
          <TextField
            value={effectiveLoc ? `${effectiveLoc.lat}, ${effectiveLoc.lng}` : ""}
            readOnly
            placeholder={bep.PickLocation}
            style={{ color: "#555", background: "#fafafa" }}
          />
        </div>

        {!isPicking && (
          <span
            style={{ color: "#2E7D32", fontWeight: 600, fontSize: 14, cursor: "pointer" }}
            onClick={onStartPick}
          >
            {bep.PickLocation}
          </span>
        )}

        {!isPicking && (
          <Pressable
            type="submit"
            disabled={busy}
            style={{
              backgroundColor: "#2E7D32",
              color: "#fff",
              border: "none",
              borderRadius: 12,
              padding: "14px 0",
              fontWeight: 700,
              fontSize: 15,
              textAlign: "center",
              cursor: busy ? "not-allowed" : "pointer",
              marginTop: 4,
            }}
          >
            {busy ? bep.Saving : bep.Add}
          </Pressable>
        )}
      </form>

      {isPicking && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 14 }}>
          <span style={{ color: "#888", fontSize: 13 }}>{bep.MapOrMarker}</span>
          <Pressable
            type="button"
            onClick={onFinishPick}
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
            {bep.FinishPicking}
          </Pressable>
          <span
            style={{ color: "#d32f2f", fontWeight: 600, fontSize: 14, cursor: "pointer", textAlign: "center" }}
            onClick={onCancelPick}
          >
            {bep.CancelPicking}
          </span>
        </div>
      )}
    </Panel>
  );
}
