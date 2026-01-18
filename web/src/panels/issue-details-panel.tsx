import type { IssueDto } from "@app/shared";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { issueApi } from "../util/services";
import { Panel } from "./panel";
import { Pressable } from "../main/pressable";

export function IssueDetailsPanel() {
  const { id } = useParams();
  const issueId = id!;
  const nav = useNavigate();
  const loc = useLocation();

  const from = (loc.state as any)?.from as string | undefined;

  const [item, setItem] = useState<IssueDto | null>(null);
  const [busy, setBusy] = useState(false);

  const ctrl = useRef<AbortController | null>(null);

  useEffect(() => {
    ctrl.current?.abort();
    ctrl.current = new AbortController();
    const signal = ctrl.current.signal;

    setBusy(true);
    issueApi
      .getById(issueId, signal)
      .then(setItem)
      .catch(() => {})
      .finally(() => setBusy(false));

    return () => ctrl.current?.abort();
  }, [issueId]);

  const closeTo = () => (from ? nav(from) : nav("/issues"));

  return (
    <Panel title="Detalji iznajmljivanja" onClose={closeTo}>
      {busy && !item ? <div>Učitavanje...</div> : null}
      {!item ? null : (
        <div style={{ display: "grid", gap: 10 }}>
          <div><b>ID:</b> {item.id}</div>
          <div><b>User:</b> {item.userId}</div>
          <div><b>Bike:</b> {item.bikeId}</div>
          <div><b>Start:</b> {item.reportedAt}</div>
          <div><b>Opis:</b> {item.description}</div>

          <Pressable
            type="button"
            onClick={() =>
              nav(`/issues/${item.id}/images`, { state: { from: `/issues/${item.id}` } })
            }
          >
            Prikaži fotografije
          </Pressable>

          <Pressable type="button" variant="secondary" onClick={closeTo}>
            Nazad
          </Pressable>
        </div>
      )}
    </Panel>
  );
}
