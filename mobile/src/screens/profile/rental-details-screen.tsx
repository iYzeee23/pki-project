import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ProfileStackParamList } from "../../navigation/types";
import * as rentalsApi from "../../services/rental-api";
import * as bikesApi from "../../services/bike-api";
import { BikeDto, formatDateTime, formatDurationFromStartEnd, RentalDto } from "@app/shared";
import { getApiErrorMessage, isCanceled } from "../../util/api-error";

type Props = NativeStackScreenProps<ProfileStackParamList, "RentalDetails">;

export function RentalDetailsScreen({ route }: Props) {
  const { rentalId } = route.params;

  const [loading, setLoading] = useState(true);
  const [rental, setRental] = useState<RentalDto | undefined>(undefined);
  const [bike, setBike] = useState<BikeDto | undefined>(undefined);

  useEffect(() => {
    if (!rentalId) return;

    const controller = new AbortController();

    const load = async () => {
      setLoading(true);

      try {
        const r = await rentalsApi.getById(rentalId, controller.signal);
        setRental(r);

        const b = await bikesApi.getById(r.bikeId, controller.signal);
        setBike(b);
      }
      catch (e: any) {
        if (isCanceled(e)) return;
        Alert.alert("Error", getApiErrorMessage(e));
      }
      finally {
        setLoading(false);
      }
    }

    load();

    return () => {
      controller.abort();
    };
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
  const duration = formatDurationFromStartEnd(rental.startAt, rental.endAt!);

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
