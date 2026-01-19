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

export function BikeEditPanel() {
  const { t } = useTranslation();
  const bep = bikeEditTexts(t);

  const { id } = useParams();
  const bikeId = id!;
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

  const onClose = () => {
    stopPickLocation();
    nav(`/map/bike/${bikeId}`);
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

    const pph = Number(pricePerHour);
    if (!type.trim()) return alert(bep.ErrBikeType);
    if (!Number.isFinite(pph) || pph <= 0) return alert(bep.ErrPrice);
    if (!effectiveLoc) return alert(bep.ErrLocation);

    saveCtrl.current?.abort();
    saveCtrl.current = new AbortController();
    const signal = saveCtrl.current.signal;

    setBusy(true);
    try {
      const updated = await bikeApi.update(
        bikeId,
        {
          type: type.trim(),
          pricePerHour: pph,
          status,
          location: effectiveLoc,
        },
        signal
      );

      upsertBike(updated);
      setBike(updated);

      stopPickLocation();
      nav(`/map/bike/${bikeId}`);
    } catch (err: any) {
      alert(err?.message ?? bep.ErrSaving);
    } finally {
      setBusy(false);
    }
  };

  if (!bike) return null;

  return (
    <Panel title={bep.BikeEdit} onClose={onClose}>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 10 }}>
        <label style={{ display: "grid", gap: 6 }}>
          <b>{bep.Type}</b>
          <TextField value={type} onChange={(e) => setType(e.target.value)} />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <b>{bep.Price}</b>
          <TextField
            value={pricePerHour}
            onChange={(e) => setPricePerHour(e.target.value)}
            inputMode="numeric"
          />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <b>{bep.Status}</b>
          <SelectField value={status} onChange={(e) => setStatus(e.target.value as BikeStatus)}>
            {BIKE_STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </SelectField>
        </label>

        <div style={{ display: "grid", gap: 6 }}>
          <b>{bep.Location}</b>
          <div style={{ opacity: 0.85 }}>
            {effectiveLoc?.lat.toFixed(5)}, {effectiveLoc?.lng.toFixed(5)}
          </div>

          {editingBikeId === bikeId ? (
            <div style={{ display: "flex", gap: 10 }}>
              <Pressable type="button" onClick={onCancelPick}>
                {bep.StopPicking}
              </Pressable>
              <div style={{ opacity: 0.7, alignSelf: "center" }}>
                {bep.MapOrMarker}
              </div>
            </div>
          ) : (
            <Pressable type="button" onClick={onStartPick}>
              {bep.ChangeLocation}
            </Pressable>
          )}
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
          <Pressable type="submit" disabled={busy} variant="primary">
            {busy ? bep.Saving : bep.Save}
          </Pressable>

          <Pressable type="button" onClick={onClose} variant="secondary">
            {bep.Dismiss}
          </Pressable>
        </div>
      </form>
    </Panel>
  );
}
