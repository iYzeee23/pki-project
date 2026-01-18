import { DateField } from "./date-field";
import { Pressable } from "./pressable";
import { SelectField } from "./select-field";
import { TextField } from "./text-field";

export type SortDir = "asc" | "desc";

export type CommonFilters = {
  userId: string;
  bikeId: string;
  day: string; // YYYY-MM-DD
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
          <b>User</b>
          <TextField
            value={value.userId}
            onChange={(e) => onChange({ ...value, userId: e.target.value })}
            placeholder="userId..."
          />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <b>Bike ID</b>
          <TextField
            value={value.bikeId}
            onChange={(e) => onChange({ ...value, bikeId: e.target.value })}
            placeholder="bikeId..."
          />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <b>Datum</b>
          <DateField
            value={value.day}
            onChange={(e) => onChange({ ...value, day: e.target.value })}
          />
        </label>
      </div>

      <div style={{ display: "flex", gap: 10, alignItems: "end" }}>
        <label style={{ display: "grid", gap: 6 }}>
          <b>Sort by</b>
          <SelectField
            value={value.sortBy}
            onChange={(e) => onChange({ ...value, sortBy: e.target.value as any })}
          >
            <option value="day">Datum</option>
            <option value="userId">User</option>
            <option value="bikeId">Bike ID</option>
          </SelectField>
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <b>Direction</b>
          <SelectField
            value={value.sortDir}
            onChange={(e) => onChange({ ...value, sortDir: e.target.value as any })}
          >
            <option value="desc">DESC</option>
            <option value="asc">ASC</option>
          </SelectField>
        </label>

        <Pressable type="button" onClick={onReset} variant="secondary" style={{ marginLeft: "auto" }}>
          Reset
        </Pressable>
      </div>
    </div>
  );
}
