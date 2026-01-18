import { resolveImageUrl, type ImageDto } from "@app/shared";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { imageApi } from "../../util/services";
import { Panel } from "../panel";
import { DEFAULT_PROFILE_PICTURE_RESOLVED, VITE_API_BASE_URL } from "../../util/config";
import { Pressable } from "../../elements/pressable";

export function IssueImagesPanel() {
  const { id } = useParams();
  const ownerId = id!;
  const nav = useNavigate();
  const loc = useLocation();

  const from = (loc.state as any)?.from as string | undefined;

  const [items, setItems] = useState<ImageDto[]>([]);
  const [busy, setBusy] = useState(false);

  const ctrl = useRef<AbortController | null>(null);

  useEffect(() => {
    ctrl.current?.abort();
    ctrl.current = new AbortController();
    const signal = ctrl.current.signal;

    setBusy(true);
    imageApi
      .fetch("Issue", ownerId, signal)
      .then(setItems)
      .catch(() => {})
      .finally(() => setBusy(false));

    return () => ctrl.current?.abort();
  }, [ownerId]);

  const closeTo = () => (from ? nav(from) : nav(`/issues/${ownerId}`));

  return (
    <Panel title="Fotografije (iznajmljivanje)" onClose={closeTo}>
      {busy ? <div>Učitavanje...</div> : null}

      <div style={{ display: "grid", gap: 12 }}>
        {items.map((img) => (
          <div key={img.id} style={{ display: "grid", gap: 8 }}>
            <div style={{ opacity: 0.7, fontSize: 12 }}>{img.takenAt}</div>
            <img
              src={resolveImageUrl(VITE_API_BASE_URL, img.path)}
              onError={(e) => ((e.currentTarget.src = DEFAULT_PROFILE_PICTURE_RESOLVED))}
              style={{ width: "100%", borderRadius: 14, border: "1px solid #e5e5e5" }}
            />
          </div>
        ))}

        {!busy && items.length === 0 ? <div>Nema fotografija.</div> : null}

        <Pressable type="button" variant="secondary" onClick={closeTo}>
          Nazad
        </Pressable>
      </div>
    </Panel>
  );
}
