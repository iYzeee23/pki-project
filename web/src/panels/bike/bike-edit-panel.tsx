import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BIKE_STATUSES, type BikeDto, type BikeStatus } from "@app/shared";
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

interface BikeEditPanelProps {
  statusOnly?: boolean;
  bikeIdOverride?: string;
  returnTo?: string;
  titleOverride?: string;
}

export function BikeEditPanel({ statusOnly, bikeIdOverride, returnTo, titleOverride }: BikeEditPanelProps = {}) {
  const { t } = useTranslation();
  const bep = bikeEditTexts(t);

  const { id } = useParams();
  const bikeId = bikeIdOverride ?? id!;
  const nav = useNavigate();

  const upsertBike = useBikesStore(s => s.upsertBike);
  const storeBike = useBikesStore(s => s.bikes.find(b => b.id === bikeId));

  const editingBikeId = useDraftStore(s => s.editingBikeId);
  const pickedLocation = useDraftStore(s => s.pickedLocation);
  const startPickLocation = useDraftStore(s => s.startPickLocation);
  const stopPickLocation = useDraftStore(s => s.stopPickLocation);

  const [bike, setBike] = useState<BikeDto | null>(storeBike ?? null);

  const [type, setType] = useState(storeBike?.type ?? "");
  const [pricePerHour, setPricePerHour] = useState(String(storeBike?.pricePerHour ?? ""));
  const [status, setStatus] = useState<BikeStatus>(storeBike?.status ?? "Available");
  const [busy, setBusy] = useState(false);

  const loadCtrl = useRef<AbortController | null>(null);
  const saveCtrl = useRef<AbortController | null>(null);

  useEffect(() => {
    if (storeBike) {
      setBike(storeBike);
      setType(storeBike.type);
      setPricePerHour(String(storeBike.pricePerHour));
      setStatus(storeBike.status);
      return;
    }

    loadCtrl.current?.abort();
    loadCtrl.current = new AbortController();
    const signal = loadCtrl.current.signal;

    bikeApi.getById(bikeId, signal).then((b) => {
      setBike(b);
      setType(b.type);
      setPricePerHour(String(b.pricePerHour));
      setStatus(b.status);
    }).catch(() => {});
    return () => loadCtrl.current?.abort();
  }, [bikeId, storeBike]);

  const effectiveLoc = useMemo(() => {
    if (!bike) return null;
    if (editingBikeId === bikeId && pickedLocation) return pickedLocation;
    return bike.location;
  }, [bike, editingBikeId, bikeId, pickedLocation]);

  const closePath = returnTo ?? `/map/bike/${bikeId}`;

  const onClose = () => {
    stopPickLocation();
    nav(closePath);
  };

  const onStartPick = () => {
    if (!bike) return;

    const pinColor = bike.status === "Available" ?
        bikeAvailableIcon : bike.status === "Busy" ?
        bikeBusyIcon : bikeOtherIcon;

    startPickLocation(bikeId, pinColor, effectiveLoc ?? bike.location);
  };

  const onCancelPick = () => {
    stopPickLocation();
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bike) return;

    saveCtrl.current?.abort();
    saveCtrl.current = new AbortController();
    const signal = saveCtrl.current.signal;

    setBusy(true);
    try {
      let updated: BikeDto;

      if (statusOnly) {
        updated = await bikeApi.changeStatus(bikeId, status, signal);
      } else {
        const pph = Number(pricePerHour);
        if (!type.trim()) return alert(bep.ErrBikeType);
        if (!Number.isFinite(pph) || pph <= 0) return alert(bep.ErrPrice);
        if (!effectiveLoc) return alert(bep.ErrLocation);

        updated = await bikeApi.update(
          bikeId,
          {
            type: type.trim(),
            pricePerHour: pph,
            status,
            location: effectiveLoc,
          },
          signal
        );
      }

      upsertBike(updated);
      setBike(updated);

      stopPickLocation();
      nav(closePath);
    } catch (err: any) {
      alert(err?.message ?? bep.ErrSaving);
    } finally {
      setBusy(false);
    }
  };

  if (!bike) return null;

  const labelStyle: React.CSSProperties = {
    fontSize: 13,
    fontWeight: 600,
    color: "#2E7D32",
    marginBottom: 2,
  };

  const isPicking = editingBikeId === bikeId;

  const disableField = statusOnly || isPicking;

  return (
    <Panel title={titleOverride ?? bep.BikeEdit} onClose={onClose} noBackdrop={isPicking}>
      <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, opacity: disableField ? 0.5 : 1 }}>
          <span style={labelStyle}>{bep.Type}</span>
          <TextField value={type} onChange={(e) => setType(e.target.value)} disabled={disableField} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 4, opacity: disableField ? 0.5 : 1 }}>
          <span style={labelStyle}>{bep.Price}</span>
          <TextField
            value={pricePerHour}
            onChange={(e) => setPricePerHour(e.target.value)}
            inputMode="numeric"
            disabled={disableField}
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

        <div style={{ display: "flex", flexDirection: "column", gap: 4, opacity: disableField ? 0.5 : 1 }}>
          <span style={labelStyle}>{bep.Location}</span>
          <TextField
            value={effectiveLoc ? `${effectiveLoc.lat}, ${effectiveLoc.lng}` : ""}
            readOnly
            style={{ color: "#555", background: "#fafafa" }}
          />
        </div>

        {!statusOnly && isPicking ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span
              style={{ color: "#2E7D32", fontWeight: 600, fontSize: 14, cursor: "pointer" }}
              onClick={onCancelPick}
            >
              {bep.StopPicking}
            </span>
            <span style={{ color: "#888", fontSize: 13 }}>{bep.MapOrMarker}</span>
          </div>
        ) : !statusOnly ? (
          <span
            style={{ color: "#2E7D32", fontWeight: 600, fontSize: 14, cursor: "pointer" }}
            onClick={onStartPick}
          >
            {bep.ChangeLocation}
          </span>
        ) : null}

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
          {busy ? bep.Saving : bep.Save}
        </Pressable>
      </form>
    </Panel>
  );
}
