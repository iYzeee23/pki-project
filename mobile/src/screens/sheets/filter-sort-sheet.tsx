import { forwardRef, useImperativeHandle, useMemo, useRef, useState } from "react";
import { Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import DateTimePicker from "@react-native-community/datetimepicker";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { filterSortTexts } from "../../i18n/i18n-builder";
import { Draft } from "@app/shared";

const GREEN = "#2E7D32";

export type SheetKind = "filter" | "sort";
export type FieldKind = "date" | "dateRange" | "text" | "number";

export type FilterFieldSpec = {
  key: string;
  label: string;
  kind: FieldKind;
  placeholder?: string;
};

export type SortOptionSpec = {
  key: string;
  label: string;
  value?: any;
};

export type FilterSortSheetHandle = {
  open: () => void;
  close: () => void;
};

type Props = {
  title: string;
  kind: SheetKind;

  filterSpec?: FilterFieldSpec[];
  initialDraft?: Draft;
  onApplyFilter?: (next: Draft) => void;
  getFilterSummary?: (key: string, draft: Draft) => string;

  sortSpec?: SortOptionSpec[];
  initialSortKey?: string;
  onApplySort?: (sortKey: string) => void;

  onDiscard?: () => void;
};

/* ── date helpers ── */

function startOfDay(d: Date) {
  const c = new Date(d);
  c.setHours(0, 0, 0, 0);
  return c;
}

function presetToday() {
  const d = startOfDay(new Date());
  return { from: d, to: new Date(d) };
}

function presetThisWeek() {
  const now = new Date();
  const day = now.getDay();
  const mon = startOfDay(new Date(now));
  mon.setDate(now.getDate() - ((day + 6) % 7));
  const sun = new Date(mon);
  sun.setDate(mon.getDate() + 6);
  return { from: mon, to: sun };
}

function presetThisMonth() {
  const now = new Date();
  return {
    from: new Date(now.getFullYear(), now.getMonth(), 1),
    to: new Date(now.getFullYear(), now.getMonth() + 1, 0),
  };
}

function fmtDate(d: Date) {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}-${mm}-${d.getFullYear()}`;
}

export const FilterSortSheet = forwardRef<FilterSortSheetHandle, Props>(function FilterSortSheet(props, ref) {
  const { t } = useTranslation();
  const fst = filterSortTexts(t);

  const sheetRef = useRef<any>(null);
  const dismissReasonRef = useRef<"discard" | "apply" | "unknown">("unknown");
  const snapPoints = useMemo(() => ["55%", "85%"], []);

  const [draft, setDraft] = useState<Draft>(props.initialDraft ?? {});
  const [sortKeyDraft, setSortKeyDraft] = useState<string>(props.initialSortKey ?? "");
  const [activeDatePicker, setActiveDatePicker] = useState<string | null>(null);

  const filterSpec = props.filterSpec ?? [];
  const sortSpec = props.sortSpec ?? [];

  /* ── helpers ── */

  function resetFromApplied() {
    setDraft(props.initialDraft ?? {});
    setSortKeyDraft(props.initialSortKey ?? "");
    setActiveDatePicker(null);
  }

  function setDraftValue(key: string, value: any) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  function clearDraft() {
    setDraft({});
    setActiveDatePicker(null);
  }

  function open() {
    resetFromApplied();
    dismissReasonRef.current = "unknown";
    sheetRef.current?.present();
  }

  function close(discard = true) {
    dismissReasonRef.current = discard ? "discard" : "apply";
    sheetRef.current?.dismiss();
  }

  useImperativeHandle(ref, () => ({
    open,
    close: () => close(true),
  }));

  function apply() {
    if (props.kind === "filter") props.onApplyFilter?.(draft);
    else props.onApplySort?.(sortKeyDraft);
    close(false);
  }

  function discard() {
    close(true);
  }

  /* ── date picker callback ── */

  function onDateChange(_: any, selected?: Date) {
    if (Platform.OS === "android") setActiveDatePicker(null);
    if (!selected || !activeDatePicker) return;
    setDraftValue(activeDatePicker, selected);
    if (Platform.OS === "ios") setActiveDatePicker(null);
  }

  /* ── date presets ── */

  function applyPreset(preset: { from: Date; to: Date }, rangeKey: string) {
    setDraft((prev) => ({
      ...prev,
      [`${rangeKey}From`]: preset.from,
      [`${rangeKey}To`]: preset.to,
    }));
  }

  /* ── render a single filter field ── */

  function renderField(field: FilterFieldSpec) {
    if (field.kind === "text" || field.kind === "number") {
      return (
        <View key={field.key} style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>{field.label}</Text>
          <TextInput
            value={String(draft[field.key] ?? "")}
            onChangeText={(txt) => setDraftValue(field.key, txt)}
            placeholder={field.placeholder ?? field.label}
            placeholderTextColor="#999"
            autoCapitalize="none"
            keyboardType={field.kind === "number" ? "number-pad" : "default"}
            style={styles.textInput}
          />
        </View>
      );
    }

    if (field.kind === "dateRange") {
      const fromKey = `${field.key}From`;
      const toKey = `${field.key}To`;
      const fromVal = draft[fromKey] instanceof Date ? (draft[fromKey] as Date) : null;
      const toVal = draft[toKey] instanceof Date ? (draft[toKey] as Date) : null;

      return (
        <View key={field.key} style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>{field.label}</Text>

          <View style={styles.dateRow}>
            <View style={styles.dateCol}>
              <Text style={styles.dateSubLabel}>{fst.From}</Text>
              <TouchableOpacity style={styles.datePicker} onPress={() => setActiveDatePicker(fromKey)}>
                <Text style={[styles.dateText, !fromVal && styles.datePlaceholder]}>
                  {fromVal ? fmtDate(fromVal) : fst.PickDate}
                </Text>
                <MaterialCommunityIcons name="calendar-outline" size={18} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.dateCol}>
              <Text style={styles.dateSubLabel}>{fst.To}</Text>
              <TouchableOpacity style={styles.datePicker} onPress={() => setActiveDatePicker(toKey)}>
                <Text style={[styles.dateText, !toVal && styles.datePlaceholder]}>
                  {toVal ? fmtDate(toVal) : fst.PickDate}
                </Text>
                <MaterialCommunityIcons name="calendar-outline" size={18} color="#666" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.presetRow}>
            <TouchableOpacity style={styles.presetChip} onPress={() => applyPreset(presetToday(), field.key)}>
              <Text style={styles.presetText}>{fst.Today}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.presetChip} onPress={() => applyPreset(presetThisWeek(), field.key)}>
              <Text style={styles.presetText}>{fst.ThisWeek}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.presetChip} onPress={() => applyPreset(presetThisMonth(), field.key)}>
              <Text style={styles.presetText}>{fst.ThisMonth}</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    if (field.kind === "date") {
      const val = draft[field.key] instanceof Date ? (draft[field.key] as Date) : null;
      return (
        <View key={field.key} style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>{field.label}</Text>
          <TouchableOpacity style={styles.datePicker} onPress={() => setActiveDatePicker(field.key)}>
            <Text style={[styles.dateText, !val && styles.datePlaceholder]}>
              {val ? fmtDate(val) : fst.PickDate}
            </Text>
            <MaterialCommunityIcons name="calendar-outline" size={18} color="#666" />
          </TouchableOpacity>
        </View>
      );
    }

    return null;
  }

  /* ── backdrop ── */

  const backdrop = (p: any) => (
    <BottomSheetBackdrop {...p} appearsOnIndex={0} disappearsOnIndex={-1} pressBehavior="close" />
  );

  return (
    <BottomSheetModal
      ref={sheetRef}
      snapPoints={snapPoints}
      backdropComponent={backdrop}
      enablePanDownToClose
      onDismiss={() => {
        const r = dismissReasonRef.current;
        dismissReasonRef.current = "unknown";
        if (r !== "apply") props.onDiscard?.();
      }}
    >
      <BottomSheetScrollView contentContainerStyle={styles.content}>
        {/* ── Header ── */}
        <View style={styles.header}>
          <TouchableOpacity onPress={discard} style={styles.headerBtn}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#333" />
          </TouchableOpacity>

          {props.kind === "filter" ? (
            <TouchableOpacity onPress={clearDraft} style={styles.headerBtn}>
              <Text style={styles.resetText}>{fst.Reset}</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={discard} style={styles.headerBtn}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* ── Filter fields (all inline) ── */}
        {props.kind === "filter" && filterSpec.map((f) => renderField(f))}

        {/* ── Sort options ── */}
        {props.kind === "sort" && (
          <View style={styles.sortList}>
            {sortSpec.map((opt) => {
              const selected = sortKeyDraft === opt.key;
              return (
                <TouchableOpacity
                  key={opt.key}
                  onPress={() => setSortKeyDraft(opt.key)}
                  style={[styles.sortOption, selected && styles.sortOptionSelected]}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.sortLabel, selected && styles.sortLabelSelected]}>
                    {opt.label}
                  </Text>
                  <View style={[styles.radio, selected && styles.radioSelected]}>
                    {selected && <View style={styles.radioDot} />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* ── Apply button ── */}
        <TouchableOpacity style={styles.applyButton} onPress={apply} activeOpacity={0.8}>
          <Text style={styles.applyButtonText}>{fst.Apply}</Text>
        </TouchableOpacity>
      </BottomSheetScrollView>

      {/* ── Native date picker overlay ── */}
      {activeDatePicker && (
        <DateTimePicker
          mode="date"
          display="default"
          value={(draft[activeDatePicker] as Date) ?? new Date()}
          onChange={onDateChange}
        />
      )}
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 32,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  headerBtn: {
    padding: 4,
  },
  resetText: {
    fontSize: 15,
    fontWeight: "700",
    color: GREEN,
  },
  closeText: {
    fontSize: 20,
    fontWeight: "800",
    color: "#333",
  },

  /* ── filter fields ── */
  fieldGroup: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    color: "#333",
  },

  /* ── date range ── */
  dateRow: {
    flexDirection: "row",
    gap: 12,
  },
  dateCol: {
    flex: 1,
  },
  dateSubLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#888",
    marginBottom: 4,
  },
  datePicker: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  dateText: {
    fontSize: 14,
    color: "#333",
  },
  datePlaceholder: {
    color: "#999",
  },

  /* ── presets ── */
  presetRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
  },
  presetChip: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  presetText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
  },

  /* ── sort ── */
  sortList: {
    gap: 10,
    marginBottom: 20,
  },
  sortOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  sortOptionSelected: {
    borderColor: GREEN,
    backgroundColor: "#f0f8f0",
  },
  sortLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  sortLabelSelected: {
    color: GREEN,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
  },
  radioSelected: {
    borderColor: GREEN,
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: GREEN,
  },

  /* ── apply button ── */
  applyButton: {
    backgroundColor: GREEN,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
  },
  applyButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
});
