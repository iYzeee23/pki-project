import { resolveImageUrl, type ImageDto } from "@app/shared";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { imageApi } from "../../util/services";
import { Panel } from "../panel";
import { VITE_API_BASE_URL } from "../../util/config";
import { Pressable } from "../../elements/pressable";
import { ImagePreview } from "../../elements/image-preview";
import { useTranslation } from "react-i18next";
import { rentalImagesTexts } from "../../i18n/i18n-builder";

export function RentalImagesPanel() {
  const { t } = useTranslation();
  const rip = rentalImagesTexts(t);

  const { id } = useParams();
  const ownerId = id!;
  const nav = useNavigate();
  const loc = useLocation();

  const from = (loc.state as any)?.from as string | undefined;

  const [items, setItems] = useState<ImageDto[]>([]);
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const ctrl = useRef<AbortController | null>(null);

  useEffect(() => {
    ctrl.current?.abort();
    ctrl.current = new AbortController();
    const signal = ctrl.current.signal;

    setBusy(true);
    imageApi
      .fetch("Rental", ownerId, signal)
      .then(setItems)
      .catch(() => {})
      .finally(() => setBusy(false));

    return () => ctrl.current?.abort();
  }, [ownerId]);

  const closeTo = () => (from ? nav(from) : nav(`/rentals/${ownerId}`));

  return (
    <Panel title={rip.RentalImages} onClose={closeTo}>
      {busy ? <div style={{ color: "#888" }}>{rip.Loading}</div> : null}

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {items.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(90px, 1fr))",
              gap: 10,
            }}
          >
            {items.map((img) => {
              const url = resolveImageUrl(VITE_API_BASE_URL, img.path);
              return (
                <img
                  key={img.id}
                  src={url}
                  onClick={() => setPreview(url)}
                  onError={(e) => { e.currentTarget.style.display = "none"; }}
                  style={{
                    width: "100%",
                    aspectRatio: "1",
                    objectFit: "cover",
                    borderRadius: 10,
                    border: "1px solid #eee",
                    cursor: "zoom-in",
                  }}
                />
              );
            })}
          </div>
        )}

        {!busy && items.length === 0 ? (
          <div style={{ color: "#888", fontSize: 14 }}>{rip.NoImages}</div>
        ) : null}

        <Pressable
          type="button"
          onClick={closeTo}
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
          {rip.Back}
        </Pressable>
      </div>

      <ImagePreview isOpen={!!preview} src={preview ?? ""} onClose={() => setPreview(null)} />
    </Panel>
  );
}
