import { useEffect, useMemo, useRef, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { FilterSortBar, type CommonFilters } from "../../elements/filter-sort-bar";
import { issueApi } from "../../util/services";
import { isoDateOnly, type IssueDto } from "@app/shared";
import { Pressable } from "../../elements/pressable";

const DEFAULT_FILTERS: CommonFilters = {
  userId: "",
  bikeId: "",
  day: "",
  sortBy: "day",
  sortDir: "desc",
};

export function IssuesPage() {
  const nav = useNavigate();
  const loc = useLocation();

  const [items, setItems] = useState<IssueDto[]>([]);
  const [busy, setBusy] = useState(false);
  const [filters, setFilters] = useState<CommonFilters>(DEFAULT_FILTERS);

  const loadCtrl = useRef<AbortController | null>(null);

  useEffect(() => {
    loadCtrl.current?.abort();
    loadCtrl.current = new AbortController();
    const signal = loadCtrl.current.signal;

    setBusy(true);
    issueApi
      .list(signal)
      .then(setItems)
      .catch(() => {})
      .finally(() => setBusy(false));

    return () => loadCtrl.current?.abort();
  }, []);

  const view = useMemo(() => {
    const userQ = filters.userId.trim().toLowerCase();
    const bikeQ = filters.bikeId.trim().toLowerCase();
    const dayQ = filters.day;

    let arr = items.filter((r) => {
      if (userQ && !r.userId.toLowerCase().includes(userQ)) return false;
      if (bikeQ && !r.bikeId.toLowerCase().includes(bikeQ)) return false;
      if (dayQ && isoDateOnly(r.reportedAt) !== dayQ) return false;
      return true;
    });

    const dir = filters.sortDir === "asc" ? 1 : -1;

    arr = arr.slice().sort((a, b) => {
      const aDay = isoDateOnly(a.reportedAt);
      const bDay = isoDateOnly(b.reportedAt);

      const key = filters.sortBy;
      const av = key === "day" ? aDay : (a as any)[key];
      const bv = key === "day" ? bDay : (b as any)[key];

      if (av < bv) return -1 * dir;
      if (av > bv) return 1 * dir;
      return 0;
    });

    return arr;
  }, [items, filters]);

  return (
    <div style={{ position: "relative" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: 14 }}>
        <h2 style={{ margin: "6px 0 12px" }}>Iznajmljivanja</h2>

        <FilterSortBar
          value={filters}
          onChange={setFilters}
          onReset={() => setFilters(DEFAULT_FILTERS)}
        />

        {busy ? <div>Učitavanje...</div> : null}

        <div style={{ display: "grid", gap: 10 }}>
          {view.map((r) => (
            <Pressable
              key={r.id}
              onClick={() => nav(`/issues/${r.id}`, { state: { from: loc.pathname + loc.search } })}
              style={{
                textAlign: "left",
                padding: 12,
                borderRadius: 14,
                border: "1px solid #e5e5e5",
                background: "#fff",
                cursor: "pointer",
                color: "black"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                <div style={{ fontWeight: 900 }}>{isoDateOnly(r.reportedAt)}</div>
              </div>

              <div style={{ opacity: 0.9 }}>User: {r.userId}</div>
              <div style={{ opacity: 0.9 }}>Bike: {r.bikeId}</div>
            </Pressable>
          ))}

          {!busy && view.length === 0 ? <div>Nema rezultata.</div> : null}
        </div>
      </div>

      <Outlet />
    </div>
  );
}
