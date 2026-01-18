import * as React from "react";
import { Pressable } from "./pressable";
import { DEFAULT_PROFILE_PICTURE, resolveImageUrl } from "@app/shared";
import { DEFAULT_PROFILE_PICTURE_RESOLVED, VITE_API_BASE_URL } from "../util/config";

type Props = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "value" | "onChange"> & {
  profilePath: string;
  label?: string;
  error?: string;
  value?: File | null;
  onChange?: (file: File | null) => void;
  buttonText?: string;
};

export function FileField({
  profilePath,
  label,
  error,
  value,
  onChange,
  buttonText = "Izaberi fajl",
  accept,
  disabled,
  style,
  ...rest
}: Props) {
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

  const fullProfilePath = resolveImageUrl(VITE_API_BASE_URL, profilePath);

  React.useEffect(() => {
    const displayUri = value ? 
      URL.createObjectURL(value) : value === null ?
      DEFAULT_PROFILE_PICTURE_RESOLVED : fullProfilePath;

    setPreviewUrl(displayUri);

    return () => URL.revokeObjectURL(displayUri);
  }, [value]);

    const shouldDisable = () => {
      const userErasedImage = value === null;
      const userDoesntHaveImage = value === undefined && profilePath === DEFAULT_PROFILE_PICTURE;

      return userErasedImage || userDoesntHaveImage;
    }

  return (
    <div style={{ display: "grid", gap: 6 }}>
      {label ? <b style={{ fontSize: 14 }}>{label}</b> : null}

      <div
        style={{
          display: "grid",
          gap: 10,
          padding: 10,
          borderRadius: 12,
          border: `1px solid ${error ? "#d44" : "#cfcfcf"}`,
          background: "#fff",
          ...(style ?? {}),
        }}
      >
        <Pressable
          type="button"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
          style={{ whiteSpace: "nowrap" }}
        >
          {buttonText}
        </Pressable>

        {!shouldDisable() ? (
          <Pressable
            type="button"
            variant="secondary"
            disabled={disabled}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();

              if (inputRef.current) inputRef.current.value = "";
              onChange?.(null);
            }}
          >
            Ukloni
          </Pressable>
        ) : null}

        <input
          {...rest}
          ref={inputRef}
          type="file"
          accept={accept}
          disabled={disabled}
          style={{ display: "none" }}
          onChange={(e) => onChange?.(e.target.files?.[0] ?? null)}
        />

        {previewUrl ? (
          <img
            src={previewUrl}
            alt="preview"
            style={{
              width: "100%",
              maxHeight: 320,
              objectFit: "contain",
              borderRadius: 12,
              border: "1px solid #e5e5e5",
              background: "#fafafa",
            }}
          />
        ) : null}

      </div>

      {error ? <span style={{ color: "#d44", fontSize: 12 }}>{error}</span> : null}
    </div>
  );
}
