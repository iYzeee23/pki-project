import { useEffect, useMemo, useRef, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { FilterSortBar, type CommonFilters } from "../../elements/filter-sort-bar";
import { issueApi } from "../../util/services";
import { isoDateOnly, type IssueDto } from "@app/shared";
import { Pressable } from "../../elements/pressable";
import { useTranslation } from "react-i18next";
import { issuesTexts } from "../../i18n/i18n-builder";

const DEFAULT_FILTERS: CommonFilters = {
  userId: "",
  bikeId: "",
  dayFrom: "",
  dayTo: "",
  sortBy: "day",
  sortDir: "desc",
};

export function IssuesPage() {
  const { t } = useTranslation();
  const isp = issuesTexts(t);

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
    const fromQ = filters.dayFrom;
    const toQ = filters.dayTo;

    let arr = items.filter((r) => {
      if (userQ && !r.userId.toLowerCase().includes(userQ)) return false;
      if (bikeQ && !r.bikeId.toLowerCase().includes(bikeQ)) return false;
      const day = isoDateOnly(r.reportedAt);
      if (fromQ && day < fromQ) return false;
      if (toQ && day > toQ) return false;
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
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 16px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: 32, alignItems: "start" }}>
          <FilterSortBar
            value={filters}
            onChange={setFilters}
            onReset={() => setFilters(DEFAULT_FILTERS)}
          />

          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            height: "calc(100vh - 64px - 90px)",
            overflowY: "auto",
            padding: "16px",
            border: "1px solid #e0e0e0",
            borderRadius: 14,
            background: "#fafafa",
          }}>
            {busy ? <div style={{ color: "#888" }}>{isp.Loading}</div> : null}

            {view.map((r) => (
              <Pressable
                key={r.id}
                onClick={() => nav(`/issues/${r.id}`, { state: { from: loc.pathname + loc.search } })}
                style={{
                  textAlign: "left",
                  padding: "14px 18px",
                  borderRadius: 12,
                  background: "#fff",
                  cursor: "pointer",
                  color: "#111",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                }}
              >
                <div style={{ fontWeight: 700, fontSize: 15 }}>{isoDateOnly(r.reportedAt)}</div>
                <div style={{ fontSize: 14, marginTop: 4 }}>
                  <b>{isp.User}:</b> {r.userId}
                </div>
                <div style={{ fontSize: 14 }}>
                  <b>{isp.Bike}:</b> {r.bikeId}
                </div>
              </Pressable>
            ))}

            {!busy && view.length === 0 ? <div style={{ color: "#888" }}>{isp.NoResults}</div> : null}
          </div>
        </div>
      </div>

      <Outlet />
    </div>
  );
}
