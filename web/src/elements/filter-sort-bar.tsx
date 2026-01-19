import { useTranslation } from "react-i18next";
import { DateField } from "./date-field";
import { Pressable } from "./pressable";
import { SelectField } from "./select-field";
import { TextField } from "./text-field";
import { filterSortTexts } from "../i18n/i18n-builder";

export type SortDir = "asc" | "desc";

export type CommonFilters = {
  userId: string;
  bikeId: string;
  day: string; 
  sortBy: "userId" | "bikeId" | "day";
  sortDir: SortDir;
};

export function FilterSortBar({
  value,
  onChange,
  onReset,
}: {
  value: CommonFilters;
  onChange: (next: CommonFilters) => void;
  onReset: () => void;
}) {
  const { t } = useTranslation();
  const fsb = filterSortTexts(t);

  return (
    <div
      style={{
        display: "grid",
        gap: 10,
        padding: 12,
        border: "1px solid #e5e5e5",
        borderRadius: 14,
        background: "#fff",
        marginBottom: 12,
        color: "black"
      }}
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        <label style={{ display: "grid", gap: 6 }}>
          <b>{fsb.User}</b>
          <TextField
            value={value.userId}
            onChange={(e) => onChange({ ...value, userId: e.target.value })}
            placeholder={fsb.PlaceholderUserId}
          />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <b>{fsb.BikeId}</b>
          <TextField
            value={value.bikeId}
            onChange={(e) => onChange({ ...value, bikeId: e.target.value })}
            placeholder={fsb.PlaceholderBikeId}
          />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <b>{fsb.Date}</b>
          <DateField
            value={value.day}
            onChange={(e) => onChange({ ...value, day: e.target.value })}
          />
        </label>
      </div>

      <div style={{ display: "flex", gap: 10, alignItems: "end" }}>
        <label style={{ display: "grid", gap: 6 }}>
          <b>{fsb.SortBy}</b>
          <SelectField
            value={value.sortBy}
            onChange={(e) => onChange({ ...value, sortBy: e.target.value as any })}
          >
            <option value="day">{fsb.Date}</option>
            <option value="userId">{fsb.User}</option>
            <option value="bikeId">{fsb.BikeId}</option>
          </SelectField>
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <b>{fsb.Direction}</b>
          <SelectField
            value={value.sortDir}
            onChange={(e) => onChange({ ...value, sortDir: e.target.value as any })}
          >
            <option value="desc">{fsb.Desc}</option>
            <option value="asc">{fsb.Asc}</option>
          </SelectField>
        </label>

        <Pressable type="button" onClick={onReset} variant="secondary" style={{ marginLeft: "auto" }}>
          {fsb.Reset}
        </Pressable>
      </div>
    </div>
  );
}
