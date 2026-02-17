import { useTranslation } from "react-i18next";
import { DateField } from "./date-field";
import { SelectField } from "./select-field";
import { TextField } from "./text-field";
import { filterSortTexts } from "../i18n/i18n-builder";

export type SortDir = "asc" | "desc";

export type CommonFilters = {
  userId: string;
  bikeId: string;
  dayFrom: string;
  dayTo: string;
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

  const today = new Date();
  const iso = (d: Date) => d.toISOString().slice(0, 10);

  const setToday = () => {
    const d = iso(today);
    onChange({ ...value, dayFrom: d, dayTo: d });
  };

  const setThisWeek = () => {
    const day = today.getDay();
    const diff = day === 0 ? 6 : day - 1;
    const mon = new Date(today);
    mon.setDate(today.getDate() - diff);
    const sun = new Date(mon);
    sun.setDate(mon.getDate() + 6);
    onChange({ ...value, dayFrom: iso(mon), dayTo: iso(sun) });
  };

  const setThisMonth = () => {
    const start = new Date(today.getFullYear(), today.getMonth(), 1);
    const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    onChange({ ...value, dayFrom: iso(start), dayTo: iso(end) });
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 14,
    fontWeight: 600,
    color: "#333",
    marginBottom: 2,
  };

  const chipStyle = (active: boolean): React.CSSProperties => ({
    padding: "6px 16px",
    borderRadius: 20,
    border: active ? "1.5px solid #2E7D32" : "1px solid #ccc",
    background: active ? "rgba(46,125,50,0.08)" : "#fff",
    color: active ? "#2E7D32" : "#555",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
  });

  const todayStr = iso(today);
  const monDate = (() => { const d = today.getDay(); const diff = d === 0 ? 6 : d - 1; const m = new Date(today); m.setDate(today.getDate() - diff); return iso(m); })();
  const sunDate = (() => { const m = new Date(monDate); m.setDate(m.getDate() + 6); return iso(m); })();
  const monthStart = iso(new Date(today.getFullYear(), today.getMonth(), 1));
  const monthEnd = iso(new Date(today.getFullYear(), today.getMonth() + 1, 0));

  const isToday = value.dayFrom === todayStr && value.dayTo === todayStr;
  const isWeek = value.dayFrom === monDate && value.dayTo === sunDate;
  const isMonth = value.dayFrom === monthStart && value.dayTo === monthEnd;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
        padding: "20px 24px",
        borderRadius: 14,
        background: "#fff",
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        color: "#111",
      }}
    >
      {/* User */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span style={labelStyle}>{fsb.User}</span>
        <TextField
          value={value.userId}
          onChange={(e) => onChange({ ...value, userId: e.target.value })}
          placeholder={fsb.PlaceholderUserId}
        />
      </div>

      {/* Bike */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span style={labelStyle}>{fsb.BikeId}</span>
        <TextField
          value={value.bikeId}
          onChange={(e) => onChange({ ...value, bikeId: e.target.value })}
          placeholder={fsb.PlaceholderBikeId}
        />
      </div>

      {/* Date range */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <span style={labelStyle}>{fsb.RentalDate}</span>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
            <span style={{ fontSize: 12, color: "#888" }}>{fsb.From}</span>
            <DateField
              value={value.dayFrom}
              onChange={(e) => onChange({ ...value, dayFrom: e.target.value })}
            />
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
            <span style={{ fontSize: 12, color: "#888" }}>{fsb.To}</span>
            <DateField
              value={value.dayTo}
              onChange={(e) => onChange({ ...value, dayTo: e.target.value })}
            />
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
          <button type="button" style={chipStyle(isToday)} onClick={setToday}>{fsb.Today}</button>
          <button type="button" style={chipStyle(isWeek)} onClick={setThisWeek}>{fsb.ThisWeek}</button>
          <button type="button" style={chipStyle(isMonth)} onClick={setThisMonth}>{fsb.ThisMonth}</button>
        </div>
      </div>

      {/* Sort */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <span style={labelStyle}>{fsb.SortBy}</span>
        <div style={{ display: "flex", gap: 12 }}>
          <SelectField
            value={value.sortBy}
            onChange={(e) => onChange({ ...value, sortBy: e.target.value as any })}
            style={{ flex: 1 }}
          >
            <option value="day">{fsb.Date}</option>
            <option value="userId">{fsb.User}</option>
            <option value="bikeId">{fsb.BikeId}</option>
          </SelectField>
          <SelectField
            value={value.sortDir}
            onChange={(e) => onChange({ ...value, sortDir: e.target.value as any })}
            style={{ flex: 1 }}
          >
            <option value="desc">{fsb.Desc}</option>
            <option value="asc">{fsb.Asc}</option>
          </SelectField>
        </div>
      </div>

      {/* Apply + Reset */}
      <button
        type="button"
        style={{
          backgroundColor: "#2E7D32",
          color: "#fff",
          border: "none",
          borderRadius: 12,
          padding: "14px 0",
          fontWeight: 700,
          fontSize: 15,
          cursor: "pointer",
          marginTop: 4,
        }}
      >
        {fsb.Apply}
      </button>
      <span
        onClick={onReset}
        style={{
          color: "#2E7D32",
          fontWeight: 600,
          fontSize: 14,
          cursor: "pointer",
          textAlign: "center",
        }}
      >
        {fsb.Reset}
      </span>
    </div>
  );
}
