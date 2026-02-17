import { useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ProfileStackParamList } from "../../navigation/types";
import { useTranslation } from "react-i18next";
import { commonTexts, rentalHistoryTexts } from "../../i18n/i18n-builder";
import { FilterFieldSpec, FilterSortSheet, FilterSortSheetHandle } from "../sheets/filter-sort-sheet";
import { Draft, isCanceled, isoDateOnly, RentalDto } from "@app/shared";
import { rentalApi } from "../../util/services";
import { getApiErrorMessage } from "../../util/http";

const GREEN = "#2E7D32";

function EmptyState({ rent }: any) {
  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyText}>{rent.NoRentals}</Text>
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
      contentContainerStyle={styles.listContent}
      renderItem={({ item }) => {
        const day = isoDateOnly(item.startAt);
        return (
          <TouchableOpacity
            onPress={() => navigation.navigate("RentalDetails", { rentalId: item.id })}
            style={styles.rentalCard}
            activeOpacity={0.7}
          >
            <View style={styles.cardLeft}>
              <Text style={styles.cardLine}>
                <Text style={styles.cardLabel}>{rent.Date}:</Text> {day}
              </Text>
              <Text style={styles.cardLine}>
                <Text style={styles.cardLabel}>{rent.Bike}:</Text> {item.bikeId}
              </Text>
            </View>
            <Text style={styles.cardCost}>
              {item.totalCost ?? 0} {rent.Currency}
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
    { key: "bikeId", label: rent.LabelBikeId, kind: "text", placeholder: rent.PlaceholderBikeId },
    { key: "date", label: rent.RentalDate, kind: "dateRange" },
  ], [rent.LabelBikeId, rent.PlaceholderBikeId, rent.RentalDate]);

  const filtered = useMemo(() => {
    const dateFrom = appliedFilters.dateFrom instanceof Date ? appliedFilters.dateFrom : null;
    const dateTo = appliedFilters.dateTo instanceof Date ? appliedFilters.dateTo : null;
    const bikeIdF = String(appliedFilters.bikeId ?? "").trim().toLowerCase();

    let out = rentals.filter((r) => {
      const rDate = new Date(r.startAt);

      if (dateFrom && rDate < dateFrom) return false;
      if (dateTo) {
        const endOfDay = new Date(dateTo);
        endOfDay.setHours(23, 59, 59, 999);
        if (rDate > endOfDay) return false;
      }
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
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={GREEN} />
      </View>
    );
  }

  function clearAppliedFilters() {
    setAppliedFilters({});
  }

  const hasFilters = Object.keys(appliedFilters).some(k => {
    const v = appliedFilters[k];
    return v !== undefined && v !== "" && v !== null;
  });

  return (
    <View style={styles.container}>
      {/* Title row */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>{rent.RecentRentals}</Text>
        <TouchableOpacity onPress={() => filterSheetRef.current?.open()} style={styles.filterIcon}>
          <MaterialCommunityIcons name="tune-variant" size={22} color="#555" />
        </TouchableOpacity>
      </View>

      <View style={styles.divider} />

      {hasFilters && (
        <View style={styles.filterActions}>
          <TouchableOpacity onPress={clearAppliedFilters}>
            <Text style={styles.clearFiltersText}>{rent.ClearFilters}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => sortSheetRef.current?.open()}>
            <Text style={styles.sortText}>{rent.Sort}</Text>
          </TouchableOpacity>
        </View>
      )}

      {!hasFilters && (
        <TouchableOpacity onPress={() => sortSheetRef.current?.open()} style={styles.sortOnly}>
          <Text style={styles.sortText}>{rent.Sort}</Text>
        </TouchableOpacity>
      )}

      <View style={styles.listContainer}>
        {filtered.length === 0 ? (
          <EmptyState rent={rent} />
        ) : (
          <NonEmptyState filtered={filtered} navigation={navigation} rent={rent} />
        )}
      </View>

      {filtered.length > 0 && (
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>{rent.TotalSpent}:</Text>
          <Text style={styles.totalValue}>{totalSpent} {rent.Currency}</Text>
        </View>
      )}

      <FilterSortSheet ref={filterSheetRef} title={rent.Filters} kind="filter" onDiscard={() => {}}
        filterSpec={filterSpec} initialDraft={appliedFilters} onApplyFilter={(next) => setAppliedFilters(next)}
        getFilterSummary={(key, d) => {
          if (key === "bikeId") return String(d.bikeId ?? "").trim();
          return "";
        }} />

      <FilterSortSheet ref={sortSheetRef} title={rent.Sort} kind="sort" onDiscard={() => {}}
        initialSortKey={appliedSortKey} onApplySort={(k) => setAppliedSortKey(k)}
        sortSpec={[
          { key: "date_desc", label: rent.SortDateDesc },
          { key: "date_asc", label: rent.SortDateAsc },
          { key: "cost_desc", label: rent.SortCostDesc },
          { key: "cost_asc", label: rent.SortCostAsc },
        ]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  filterIcon: {
    padding: 4,
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginTop: 12,
    marginBottom: 16,
  },
  filterActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  clearFiltersText: {
    fontSize: 13,
    color: "#d32f2f",
    fontWeight: "600",
  },
  sortOnly: {
    alignItems: "flex-end",
    marginBottom: 12,
  },
  sortText: {
    fontSize: 13,
    color: GREEN,
    fontWeight: "600",
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    gap: 10,
    paddingBottom: 8,
  },
  emptyState: {
    paddingVertical: 24,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    color: "#999",
    fontStyle: "italic",
  },
  rentalCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 14,
  },
  cardLeft: {
    flex: 1,
    gap: 2,
  },
  cardLine: {
    fontSize: 14,
    color: "#333",
  },
  cardLabel: {
    fontWeight: "700",
  },
  cardCost: {
    fontSize: 16,
    fontWeight: "700",
    color: GREEN,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 16,
    borderTopWidth: 0,
  },
  totalLabel: {
    fontSize: 15,
    color: "#666",
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "700",
    color: GREEN,
  },
});
