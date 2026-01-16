import { useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Text, TouchableOpacity, View } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ProfileStackParamList } from "../../navigation/types";
import { useTranslation } from "react-i18next";
import { commonTexts, rentalHistoryTexts } from "../../util/i18n-builder";
import { FilterFieldSpec, FilterSortSheet, FilterSortSheetHandle } from "../sheets/filter-sort-sheet";
import { Draft, isCanceled, isoDateOnly, RentalDto } from "@app/shared";
import { rentalApi } from "../../util/services";
import { getApiErrorMessage } from "../../util/http";

function EmptyState({ rent }: any) {
  return (
    <View style={{ padding: 12 }}>
      <Text>{rent.NoRentals}</Text>
    </View>
  );
}

type NonEmptyStateProps = {
  filtered: RentalDto[];
  navigation: any;
  rent: any;
};

function NonEmptyState({ filtered, navigation, rent }: NonEmptyStateProps) {
  return (
    <FlatList data={filtered} keyExtractor={(item) => item.id}
      contentContainerStyle={{ gap: 10, paddingBottom: 8 }}
      renderItem={({ item }) => {
        const day = isoDateOnly(item.startAt);
        return (
          <TouchableOpacity
            onPress={() => navigation.navigate("RentalDetails", { rentalId: item.id })}
            style={{ borderWidth: 1, borderRadius: 12, padding: 12, gap: 6 }}>
            <Text>
              <Text style={{ fontWeight: "700" }}>{rent.Date}:</Text> {day}
            </Text>
            <Text>
              <Text style={{ fontWeight: "700" }}>{rent.Bike}:</Text> {item.bikeId}
            </Text>
          </TouchableOpacity>
        );
      }}
    />
  );
}

type Props = NativeStackScreenProps<ProfileStackParamList, "RentalHistory">;

export function RentalHistoryScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const rent = rentalHistoryTexts(t);
  const com = commonTexts();

  const isFocused = useIsFocused();

  const [loading, setLoading] = useState(true);
  const [rentals, setRentals] = useState<RentalDto[]>([]);

  const [appliedFilters, setAppliedFilters] = useState<Draft>({});
  const [appliedSortKey, setAppliedSortKey] = useState<string>("date_desc");

  const filterSheetRef = useRef<FilterSortSheetHandle>(null);
  const sortSheetRef = useRef<FilterSortSheetHandle>(null);

  useEffect(() => {
    if (!isFocused) return;
    if (rentals.length > 0) return;

    const controller = new AbortController();

    const load = async () => {
      setLoading(true);
      try {
        const data = await rentalApi.history(controller.signal);
        const onlyFinished = data.filter((r) => r.endAt !== null);
        setRentals(onlyFinished);
      }
      catch (e: any) {
        if (isCanceled(e)) return;
        Alert.alert(com.Error, getApiErrorMessage(e));
      }
      finally {
        setLoading(false);
      }
    };

    load();

    return () => {
      controller.abort();
    };
  }, [isFocused]);

  const filterSpec: FilterFieldSpec[] = useMemo(() => [
    { key: "day", label: rent.Date, kind: "date" },
    { key: "bikeId", label: rent.LabelBikeId, kind: "text", placeholder: rent.PlaceholderBikeId },
  ], [rent.Date, rent.LabelBikeId, rent.Bike, rent.PlaceholderBikeId]);

  const filtered = useMemo(() => {
    const dayF = appliedFilters.day instanceof Date ? appliedFilters.day.toISOString().slice(0, 10) : "";
    const bikeIdF = String(appliedFilters.bikeId ?? "").trim().toLowerCase();

    let out = rentals.filter((r) => {
      const day = isoDateOnly(r.startAt);

      if (dayF && day !== dayF) return false;
      if (bikeIdF && !r.bikeId.toLowerCase().includes(bikeIdF)) return false;

      return true;
    });

    const copy = out.slice();
    if (appliedSortKey === "date_desc") copy.sort((a, b) => (a.startAt < b.startAt ? 1 : -1));
    else if (appliedSortKey === "date_asc") copy.sort((a, b) => (a.startAt > b.startAt ? 1 : -1));
    else if (appliedSortKey === "cost_desc") copy.sort((a, b) => (b.totalCost! - a.totalCost!));
    else if (appliedSortKey === "cost_asc") copy.sort((a, b) => (a.totalCost! - b.totalCost!));

    return copy;
  }, [rentals, appliedFilters, appliedSortKey]);

  const totalSpent = useMemo(() => {
    let sum = 0;
    for (const r of filtered) sum += r.totalCost ?? 0;
    return sum;
  }, [filtered]);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  function clearAppliedFilters() {
    setAppliedFilters({});
  }

  return (
    <View style={{ flex: 1, padding: 12, gap: 12 }}>
      <View style={{ flexDirection: "row", gap: 10 }}>
        <TouchableOpacity onPress={() => filterSheetRef.current?.open()}
          style={{ flex: 1, borderWidth: 1, borderRadius: 12, padding: 12 }}>
          <Text style={{ textAlign: "center", fontWeight: "800" }}>{rent.Filters}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => sortSheetRef.current?.open()}
          style={{ flex: 1, borderWidth: 1, borderRadius: 12, padding: 12 }}>
          <Text style={{ textAlign: "center", fontWeight: "800" }}>{rent.Sort}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={clearAppliedFilters}
        style={{ borderWidth: 1, borderRadius: 12, padding: 12, opacity: 0.95 }}>
        <Text style={{ textAlign: "center", fontWeight: "800" }}>{rent.ClearFilters}</Text>
      </TouchableOpacity>

      {filtered.length === 0 ? (
        <EmptyState rent={rent} />
      ) : (
        <NonEmptyState filtered={filtered} navigation={navigation} rent={rent} />
      )}

      {filtered.length > 0 && (
        <View style={{ borderWidth: 1, borderRadius: 12, padding: 12 }}>
          <Text style={{ fontWeight: "700" }}>
            {rent.TotalSpent}: {totalSpent}
          </Text>
        </View>
      )}

      <FilterSortSheet ref={filterSheetRef} title={rent.Filters} kind="filter" onDiscard={() => {}}
        filterSpec={filterSpec} initialDraft={appliedFilters} onApplyFilter={(next) => setAppliedFilters(next)}
        getFilterSummary={(key, d) => {
          if (key === "day") return d.day instanceof Date ? d.day.toISOString().slice(0, 10) : "";
          if (key === "bikeId") return String(d.bikeId ?? "").trim();
          return "";
        }} />

      <FilterSortSheet ref={sortSheetRef} title={rent.Sort} kind="sort" onDiscard={() => {}}
        initialSortKey={appliedSortKey} onApplySort={(k) => setAppliedSortKey(k)}
        sortSpec={[
          { key: "date_desc", label: "Date (newest first)" },
          { key: "date_asc", label: "Date (oldest first)" },
          { key: "cost_desc", label: "Cost (high → low)" },
          { key: "cost_asc", label: "Cost (low → high)" },
        ]} />
    </View>
  );
}
