import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ProfileStackParamList } from "../../navigation/types";
import * as rentalsApi from "../../services/rental-api";
import { RentalDto } from "@app/shared";
import { getApiErrorMessage } from "../../util/api-error";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";

function isoDateOnly(iso: string) {
  return iso.slice(0, 10);
}

function EmptyState() {
  return (
    <View style={{ padding: 12 }}>
      <Text>No rentals for current filter.</Text>
    </View>
  );
}

type NonEmptyStateProps = {
  filtered: RentalDto[];
  navigation: any;
};

function NonEmptyState( {filtered, navigation}: NonEmptyStateProps) {
  return (
    <FlatList
      data={filtered}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ gap: 10 }}
      renderItem={({ item }) => {
        const day = isoDateOnly(item.startAt);
        return (
          <TouchableOpacity
            onPress={() => navigation.navigate("RentalDetails", { rentalId: item.id })}
            style={{ borderWidth: 1, borderRadius: 12, padding: 12, gap: 6 }}
          >
            <Text><Text style={{ fontWeight: "700" }}>Date:</Text> {day}</Text>
            <Text><Text style={{ fontWeight: "700" }}>Bike:</Text> {item.bikeId}</Text>
          </TouchableOpacity>
        );
      }}
    />
  );
}

type Props = NativeStackScreenProps<ProfileStackParamList, "RentalHistory">;

export function RentalHistoryScreen({ navigation }: Props) {
  type FilterMode = "none" | "dateFrom" | "dateTo" | "bikeId";

  const [filterMode, setFilterMode] = useState<FilterMode>("none");

  const isFocused = useIsFocused();

  const [loading, setLoading] = useState(true);
  const [rentals, setRentals] = useState<RentalDto[]>([]);

  const [dateFrom, setDateFrom] = useState<Date | null>(null);
  const [dateTo, setDateTo] = useState<Date | null>(null);
  const [bikeIdFilter, setBikeIdFilter] = useState("");

  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (!isFocused) return;
    if (rentals.length > 0) return;

    const load = async () => {
      setLoading(true);

      try {
        const data = await rentalsApi.history();
        const onlyFinished = data.filter(r => r.endAt !== null);
        setRentals(onlyFinished);
      }
      catch (e: any) {
        Alert.alert("Error", getApiErrorMessage(e));
      }
      finally {
        setLoading(false);
      }
    };

    load();
  }, [isFocused]);

  const filtered = useMemo(() => {
    const dateFromF = dateFrom ? dateFrom.toISOString().slice(0, 10) : "";
    const dateToF = dateTo ? dateTo.toISOString().slice(0, 10) : "";
    const bikeIdF = bikeIdFilter.trim().toLowerCase();

    const filtered = rentals.filter(r => {
      const date = isoDateOnly(r.startAt);

      if (dateFromF && date < dateFromF) return false;
      if (dateToF && dateToF < date) return false;
      if (bikeIdF && r.bikeId.toLowerCase().includes(bikeIdF)) return false;

      return true;
    });

    return filtered;
  }, [rentals, dateFrom, dateTo, bikeIdFilter]);

  const totalSpent = useMemo(() => {
    let sum = 0;

    for (const r of filtered)
      sum += r.totalCost!;

    return sum;
  }, [filtered]);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  function clearFilters() {
    setFilterMode("none");
    setDateFrom(null);
    setDateTo(null);
    setBikeIdFilter("");
    setShowDatePicker(false);
  }

  return (
    <View style={{ borderWidth: 1, borderRadius: 12, padding: 12, gap: 10 }}>
      <Text style={{ fontWeight: "700" }}>Filters</Text>

      <View style={{ borderWidth: 1, borderRadius: 10 }}>
        <Picker selectedValue={filterMode} onValueChange={(v) => setFilterMode(v)}>
          <Picker.Item label="None" value="none" />
          <Picker.Item label="Date from" value="dateFrom" />
          <Picker.Item label="Date to" value="dateTo" />
          <Picker.Item label="Bike id" value="bikeId" />
        </Picker>
      </View>

      {filterMode === "bikeId" && (
        <TextInput style={{ borderWidth: 1, padding: 10, borderRadius: 10 }}
          placeholder="Bike id" value={bikeIdFilter} onChangeText={setBikeIdFilter} autoCapitalize="none" />
      )}

      {(filterMode === "dateFrom" || filterMode === "dateTo") && (
        <TouchableOpacity onPress={() => setShowDatePicker(true)}
          style={{ padding: 12, borderRadius: 12, borderWidth: 1 }}>
          <Text style={{ textAlign: "center", fontWeight: "600" }}>
            {filterMode === "dateFrom"
              ? `Pick date from${dateFrom ? `: ${dateFrom.toISOString().slice(0, 10)}` : ""}`
              : `Pick date to${dateTo ? `: ${dateTo.toISOString().slice(0, 10)}` : ""}`}
          </Text>
        </TouchableOpacity>
      )}

      {showDatePicker && (filterMode === "dateFrom" || filterMode === "dateTo") && (
        <DateTimePicker
          value={(filterMode === "dateFrom" ? dateFrom : dateTo) ?? new Date()}
          mode="date" display="default"
          onChange={(_, selected) => {
            setShowDatePicker(false);
            if (!selected) return;
            if (filterMode === "dateFrom") setDateFrom(selected);
            else setDateTo(selected);
          }}
        />
      )}

      <TouchableOpacity onPress={() => clearFilters() }
        style={{ padding: 12, borderRadius: 12, borderWidth: 1 }}>
        <Text style={{ textAlign: "center", fontWeight: "600" }}>Clear filters</Text>
      </TouchableOpacity>

      {filtered.length === 0 ? <EmptyState /> : <NonEmptyState filtered={filtered} navigation={navigation} />}

      {filtered.length > 0 && (
        <View style={{ borderWidth: 1, borderRadius: 12, padding: 12 }}>
          <Text style={{ fontWeight: "700" }}>Total spent: {totalSpent}</Text>
        </View>
      )}
    </View>
  );
}
