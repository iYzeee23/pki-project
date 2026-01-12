import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ProfileStackParamList } from "../../navigation/types";
import * as rentalsApi from "../../services/rental-api";
import * as bikesApi from "../../services/bike-api";
import { BikeDto, RentalDto } from "@app/shared";
import { getApiErrorMessage } from "../../util/api-error";

function formatDateTime(iso: string) {
  const date = new Date(iso);
  return date.toLocaleString();
}

function formatDuration(startIso: string, endIso: string) {
  const start = new Date(startIso).getTime();
  const end = new Date(endIso).getTime();

  const milliSeconds = end - start;
  const totalMinutes = Math.floor(milliSeconds / (60 * 1000));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const hh = String(hours).padStart(2, "0");
  const mm = String(minutes).padStart(2, "0");
  return `${hh}:${mm}`;
}

type Props = NativeStackScreenProps<ProfileStackParamList, "RentalDetails">;

export function RentalDetailsScreen({ route }: Props) {
  const { rentalId } = route.params;

  const [loading, setLoading] = useState(true);
  const [rental, setRental] = useState<RentalDto | undefined>(undefined);
  const [bike, setBike] = useState<BikeDto | undefined>(undefined);

  useEffect(() => {
    if (!rentalId) return;

    const load = async () => {
      setLoading(true);

      try {
        const r = await rentalsApi.getById(rentalId);
        setRental(r);

        const b = await bikesApi.getById(r.bikeId);
        setBike(b);
      }
      catch (e: any) {
        Alert.alert("Error", getApiErrorMessage(e));
      }
      finally {
        setLoading(false);
      }
    }

    load();
  }, [rentalId]);

  if (loading || !rental || !bike) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const startTime = formatDateTime(rental.startAt);
  const endTime = formatDateTime(rental.endAt!);
  const duration = formatDuration(rental.startAt, rental.endAt!);

  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: "700" }}>Rental details</Text>

      <View style={{ borderWidth: 1, borderRadius: 12, padding: 12, gap: 8 }}>
        <Text><Text style={{ fontWeight: "700" }}>Bike id:</Text> {rental.bikeId}</Text>
        <Text><Text style={{ fontWeight: "700" }}>Bike type:</Text> {bike.type}</Text>
        <Text><Text style={{ fontWeight: "700" }}>Start:</Text> {startTime}</Text>
        <Text><Text style={{ fontWeight: "700" }}>End:</Text> {endTime}</Text>
        <Text><Text style={{ fontWeight: "700" }}>Price per hour:</Text> {bike.pricePerHour}</Text>
        <Text><Text style={{ fontWeight: "700" }}>Duration:</Text> {duration}</Text>
        <Text><Text style={{ fontWeight: "700" }}>Total cost:</Text> {rental.totalCost}</Text>
        <Text><Text style={{ fontWeight: "700" }}>Description:</Text> {rental.description}</Text>
      </View>
    </View>
  );
}
