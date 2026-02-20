import { forwardRef, useImperativeHandle, useMemo, useRef, useState } from "react";
import { Modal, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import DateTimePicker from "@react-native-community/datetimepicker";
import type { DateTimePickerEvent } from "@react-native-community/datetimepicker";
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

function draftDate(value: unknown): Date | null {
  if (value instanceof Date) return value;
  if (typeof value === "string" || typeof value === "number") {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }
  return null;
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
  const [iosPickerValue, setIosPickerValue] = useState<Date>(new Date());

  const filterSpec = props.filterSpec ?? [];
  const sortSpec = props.sortSpec ?? [];

  function resetFromApplied() {
    setDraft(props.initialDraft ?? {});
    setSortKeyDraft(props.initialSortKey ?? "");
    setActiveDatePicker(null);
    setIosPickerValue(new Date());
  }

  function setDraftValue(key: string, value: any) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  function clearDraft() {
    setDraft({});
    setActiveDatePicker(null);
    setIosPickerValue(new Date());
  }

  function openDatePicker(key: string) {
    const current = draftDate(draft[key]) ?? new Date();
    setIosPickerValue(current);
    setActiveDatePicker(key);
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

  function onDateChange(event: DateTimePickerEvent, selected?: Date) {
    if (Platform.OS === "android") {
      setActiveDatePicker(null);
      if (event.type !== "set" || !selected || !activeDatePicker) return;
      setDraftValue(activeDatePicker, selected);
      return;
    }

    if (!selected || !activeDatePicker) return;
    setIosPickerValue(selected);
  }

  function applyIosDate() {
    if (!activeDatePicker) return;
    setDraftValue(activeDatePicker, iosPickerValue);
    setActiveDatePicker(null);
  }

  function applyPreset(preset: { from: Date; to: Date }, rangeKey: string) {
    setDraft((prev) => ({
      ...prev,
      [`${rangeKey}From`]: preset.from,
      [`${rangeKey}To`]: preset.to,
    }));
  }

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
      const fromVal = draftDate(draft[fromKey]);
      const toVal = draftDate(draft[toKey]);

      return (
        <View key={field.key} style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>{field.label}</Text>

          <View style={styles.dateRow}>
            <View style={styles.dateCol}>
              <Text style={styles.dateSubLabel}>{fst.From}</Text>
              <TouchableOpacity style={styles.datePicker} onPress={() => openDatePicker(fromKey)}>
                <Text style={[styles.dateText, !fromVal && styles.datePlaceholder]}>
                  {fromVal ? fmtDate(fromVal) : fst.PickDate}
                </Text>
                <MaterialCommunityIcons name="calendar-outline" size={18} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.dateCol}>
              <Text style={styles.dateSubLabel}>{fst.To}</Text>
              <TouchableOpacity style={styles.datePicker} onPress={() => openDatePicker(toKey)}>
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
      const val = draftDate(draft[field.key]);
      return (
        <View key={field.key} style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>{field.label}</Text>
          <TouchableOpacity style={styles.datePicker} onPress={() => openDatePicker(field.key)}>
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

  const backdrop = (p: any) => (
    <BottomSheetBackdrop {...p} appearsOnIndex={0} disappearsOnIndex={-1} pressBehavior="close" />
  );

  return (
    <BottomSheetModal
      ref={sheetRef}
      snapPoints={snapPoints}
      backdropComponent={backdrop}
      enablePanDownToClose
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustResize"
      onDismiss={() => {
        const r = dismissReasonRef.current;
        dismissReasonRef.current = "unknown";
        if (r !== "apply") props.onDiscard?.();
      }}
    >
      <BottomSheetScrollView contentContainerStyle={styles.content}>
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

        {props.kind === "filter" && filterSpec.map((f) => renderField(f))}

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

        <TouchableOpacity style={styles.applyButton} onPress={apply} activeOpacity={0.8}>
          <Text style={styles.applyButtonText}>{fst.Apply}</Text>
        </TouchableOpacity>
      </BottomSheetScrollView>

      {activeDatePicker && Platform.OS === "android" && (
        <DateTimePicker
          mode="date"
          display="default"
          value={draftDate(draft[activeDatePicker]) ?? new Date()}
          onChange={onDateChange}
        />
      )}

      {activeDatePicker && Platform.OS === "ios" && (
        <Modal transparent animationType="fade" visible>
          <View style={styles.iosOverlay}>
            <View style={styles.iosCard}>
              <DateTimePicker
                mode="date"
                display="spinner"
                value={iosPickerValue}
                onChange={onDateChange}
              />
              <View style={styles.iosActions}>
                <TouchableOpacity onPress={() => setActiveDatePicker(null)} style={styles.iosActionBtn}>
                  <Text style={styles.iosCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={applyIosDate} style={styles.iosActionBtn}>
                  <Text style={styles.iosDoneText}>Done</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
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
  iosOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },
  iosCard: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 8,
    paddingBottom: 20,
  },
  iosActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 8,
  },
  iosActionBtn: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  iosCancelText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#666",
  },
  iosDoneText: {
    fontSize: 16,
    fontWeight: "700",
    color: GREEN,
  },
});
