import { forwardRef, useImperativeHandle, useMemo, useRef, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useTranslation } from "react-i18next";
import { filterSortTexts } from "../../i18n/i18n-builder";
import { Draft } from "@app/shared";

export type SheetKind = "filter" | "sort";
export type FieldKind = "date" | "text" | "number";

export type FilterFieldSpec = {
  key: string;
  label: string;
  kind: FieldKind;
  placeholder?: string;
};

export type SortOptionSpec = {
  key: string;
  label: string;
  value?: any; // nije bitno za UI
};

export type FilterSortSheetHandle = {
  open: () => void;
  close: () => void;
};

type Step = "pick" | "edit";

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

export const FilterSortSheet = forwardRef<FilterSortSheetHandle, Props>(function FilterSortSheet(props, ref) {
  const { t } = useTranslation();
  const fst = filterSortTexts(t);

  const sheetRef = useRef<any>(null);

  const dismissReasonRef = useRef<"discard" | "apply" | "unknown">("unknown");

  const snapPoints = useMemo(() => ["50%", "85%"], []);

  const [step, setStep] = useState<Step>("pick");
  const [activeKey, setActiveKey] = useState<string | null>(null);

  const [draft, setDraft] = useState<Draft>(props.initialDraft ?? {});
  const [sortKeyDraft, setSortKeyDraft] = useState<string>(props.initialSortKey ?? "");

  const [showDatePicker, setShowDatePicker] = useState(false);

  function resetFromApplied() {
    setStep("pick");
    setActiveKey(null);
    setDraft(props.initialDraft ?? {});
    setSortKeyDraft(props.initialSortKey ?? "");
    setShowDatePicker(false);
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

  const filterSpec = props.filterSpec ?? [];
  const sortSpec = props.sortSpec ?? [];

  const activeField = props.kind === "filter" ? 
    filterSpec.find((f) => f.key === activeKey) ?? null : null;

  function setDraftValue(key: string, value: any) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  function apply() {
    if (props.kind === "filter") props.onApplyFilter?.(draft);
    else props.onApplySort?.(sortKeyDraft);

    close(false);
  }

  function discard() {
    close(true);
  }

  function goPick() {
    setStep("pick");
    setActiveKey(null);
    setShowDatePicker(false);
  }

  const backdrop = (p: any) => (
    <BottomSheetBackdrop {...p} appearsOnIndex={0} disappearsOnIndex={-1} pressBehavior="close" />
  );

  return (
    <BottomSheetModal ref={sheetRef} snapPoints={snapPoints}
      backdropComponent={backdrop} enablePanDownToClose
      onDismiss={() => {
        const r = dismissReasonRef.current;
        dismissReasonRef.current = "unknown";
        if (r !== "apply") props.onDiscard?.();
      }}>
      <BottomSheetView style={{ paddingHorizontal: 14, paddingTop: 10, paddingBottom: 12, flex: 1, gap: 12 }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <Text style={{ fontSize: 16, fontWeight: "800" }}>{props.title}</Text>

          <TouchableOpacity onPress={discard} style={{ padding: 8 }}>
            <Text style={{ fontSize: 18, fontWeight: "800" }}>✕</Text>
          </TouchableOpacity>
        </View>

        {step === "pick" && props.kind === "filter" && (
          <View style={{ gap: 10 }}>
            {filterSpec.map((opt) => {
              const summary = props.getFilterSummary?.(opt.key, draft) ?? "";
              return (
                <TouchableOpacity key={opt.key} onPress={() => { setActiveKey(opt.key); setStep("edit"); }}
                  style={{ borderWidth: 1, borderRadius: 12, padding: 12, gap: 4 }}>
                  <Text style={{ fontWeight: "800" }}>{opt.label}</Text>
                  {!!summary && <Text style={{ opacity: 0.7 }}>{summary}</Text>}
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {step === "pick" && props.kind === "sort" && (
          <View style={{ gap: 10 }}>
            {sortSpec.map((opt) => (
              <TouchableOpacity key={opt.key} onPress={() => setSortKeyDraft(opt.key)}
                style={{ borderWidth: 1, borderRadius: 12, padding: 12, gap: 12,
                  flexDirection: "row", alignItems: "center", justifyContent: "space-between"
                }}>
                <Text style={{ fontWeight: "800" }}>{opt.label}</Text>
                <Text style={{ fontWeight: "800" }}>{sortKeyDraft === opt.key ? "●" : "○"}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {step === "edit" && props.kind === "filter" && activeField && (
          <View style={{ gap: 12 }}>
            <TouchableOpacity onPress={goPick} style={{ paddingVertical: 6 }}>
              <Text style={{ fontWeight: "800" }}>{fst.Back}</Text>
            </TouchableOpacity>

            <Text style={{ fontSize: 15, fontWeight: "900" }}>{activeField.label}</Text>

            {activeField.kind === "date" && (
              <View style={{ gap: 10 }}>
                <TouchableOpacity
                  onPress={() => setShowDatePicker(true)}
                  style={{ borderWidth: 1, borderRadius: 12, padding: 12 }}
                >
                  <Text style={{ fontWeight: "700", textAlign: "center" }}>
                    {draft[activeField.key] instanceof Date ? 
                        (draft[activeField.key] as Date).toISOString().slice(0, 10) : fst.PickDate}
                  </Text>
                </TouchableOpacity>

                {showDatePicker && (
                  <DateTimePicker mode="date" display="default"
                    value={(draft[activeField.key] as Date) ?? new Date()}
                    onChange={(_, selected) => {
                      setShowDatePicker(false);
                      if (!selected) return;
                      setDraftValue(activeField.key, selected);
                    }} />
                )}
              </View>
            )}

            {(activeField.kind === "text" || activeField.kind === "number") && (
              <TextInput
                value={String(draft[activeField.key] ?? "")}
                onChangeText={(txt) => setDraftValue(activeField.key, txt)}
                placeholder={activeField.placeholder}
                autoCapitalize="none"
                keyboardType={activeField.kind === "number" ? "number-pad" : "default"}
                style={{ borderWidth: 1, borderRadius: 12, padding: 12 }} />
            )}
          </View>
        )}

        <View style={{ marginTop: "auto", gap: 10 }}>
          <TouchableOpacity onPress={apply} style={{ borderWidth: 1, borderRadius: 12, padding: 14 }}>
            <Text style={{ textAlign: "center", fontWeight: "900" }}>Apply</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={discard} style={{ borderWidth: 1, borderRadius: 12, padding: 14, opacity: 0.85 }}>
            <Text style={{ textAlign: "center", fontWeight: "900" }}>Discard</Text>
          </TouchableOpacity>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
});
