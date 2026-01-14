import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ProfileStackParamList } from "../../navigation/types";
import * as rentalsApi from "../../services/rental-api";
import * as bikesApi from "../../services/bike-api";
import { BikeDto, formatDateTime, formatDurationFromStartEnd, RentalDto } from "@app/shared";
import { getApiErrorMessage, isCanceled } from "../../util/api-error";
import { useTranslation } from "react-i18next";
import { commonTexts, rentalDetailsTexts } from "../../util/i18n-builder";

type Props = NativeStackScreenProps<ProfileStackParamList, "RentalDetails">;

export function RentalDetailsScreen({ route }: Props) {
  const { t } = useTranslation();
  const rent = rentalDetailsTexts(t);
  const com = commonTexts();
  
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
        Alert.alert(com.Error, getApiErrorMessage(e));
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
      <Text style={{ fontSize: 22, fontWeight: "700" }}>{rent.Title}</Text>

      <View style={{ borderWidth: 1, borderRadius: 12, padding: 12, gap: 8 }}>
        <Text><Text style={{ fontWeight: "700" }}>{rent.BikeId}:</Text> {rental.bikeId}</Text>
        <Text><Text style={{ fontWeight: "700" }}>{rent.BikeType}:</Text> {bike.type}</Text>
        <Text><Text style={{ fontWeight: "700" }}>{rent.StartTime}:</Text> {startTime}</Text>
        <Text><Text style={{ fontWeight: "700" }}>{rent.EndTime}:</Text> {endTime}</Text>
        <Text><Text style={{ fontWeight: "700" }}>{rent.Price}:</Text> {bike.pricePerHour}</Text>
        <Text><Text style={{ fontWeight: "700" }}>{rent.Duration}:</Text> {duration}</Text>
        <Text><Text style={{ fontWeight: "700" }}>{rent.TotalCost}:</Text> {rental.totalCost}</Text>
        <Text><Text style={{ fontWeight: "700" }}>{rent.Description}:</Text> {rental.description}</Text>
      </View>
    </View>
  );
}
