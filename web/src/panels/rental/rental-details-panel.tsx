import type { RentalDto } from "@app/shared";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Panel } from "../panel";
import { Pressable } from "../../elements/pressable";
import { rentalApi } from "../../util/services";
import { useTranslation } from "react-i18next";
import { rentalDetailsTexts } from "../../i18n/i18n-builder";

export function RentalDetailsPanel() {
  const { t } = useTranslation();
  const rdp = rentalDetailsTexts(t);

  const { id } = useParams();
  const rentalId = id!;
  const nav = useNavigate();
  const loc = useLocation();

  const from = (loc.state as any)?.from as string | undefined;

  const [item, setItem] = useState<RentalDto | null>(null);
  const [busy, setBusy] = useState(false);

  const ctrl = useRef<AbortController | null>(null);

  useEffect(() => {
    ctrl.current?.abort();
    ctrl.current = new AbortController();
    const signal = ctrl.current.signal;

    setBusy(true);
    rentalApi
      .getById(rentalId, signal)
      .then(setItem)
      .catch(() => {})
      .finally(() => setBusy(false));

    return () => ctrl.current?.abort();
  }, [rentalId]);

  const closeTo = () => (from ? nav(from) : nav("/rentals"));

  return (
    <Panel title={rdp.RentalDetails} onClose={closeTo}>
      {busy && !item ? <div style={{ color: "#888" }}>{rdp.Loading}</div> : null}
      {!item ? null : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              border: "1px solid #ddd",
              borderRadius: 10,
              padding: "14px 16px",
              display: "flex",
              flexDirection: "column",
              gap: 5,
              fontSize: 14,
            }}
          >
            <div><b>{rdp.ID}:</b> {item.id}</div>
            <div><b>{rdp.User}:</b> {item.userId}</div>
            <div><b>{rdp.Bike}:</b> {item.bikeId}</div>
            <div><b>{rdp.Start}:</b> {item.startAt}</div>
            <div><b>{rdp.End}:</b> {item.endAt ?? "—"}</div>
            <div><b>{rdp.Total}:</b> {item.totalCost ?? "—"}</div>
            <div><b>{rdp.Description}:</b> {item.description ?? "—"}</div>
          </div>

          <Pressable
            type="button"
            onClick={() =>
              nav(`/rentals/${item.id}/images`, { state: { from: `/rentals/${item.id}` } })
            }
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
            {rdp.ShowImages}
          </Pressable>
        </div>
      )}
    </Panel>
  );
}
