import React, { useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Alert, Button, Text, View } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { getApiErrorMessage, isCanceled } from "../../util/api-error";
import * as bikesApi from "../../services/bike-api";
import { RentalStackParamList } from "../../navigation/types";
import { useRentalStore } from "../../stores/rental-store";
import { BikeDto, findInsideSpotId, formatDurationFromMs } from "@app/shared";
import { useMapStore } from "../../stores/map-store";
import { useTranslation } from "react-i18next";
import { activeRentalTexts, commonTexts } from "../../util/i18n-builder";

type Props = NativeStackScreenProps<RentalStackParamList, "ActiveRental">;

export function ActiveRentalScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const act = activeRentalTexts(t);
  const com = commonTexts();
  
  const isFocused = useIsFocused();

  const redirectedRef = useRef(false);
  const loadingActive = useRentalStore((s) => s.loadingActive);
  const activeRental = useRentalStore((s) => s.activeRental);
  const refreshActiveRental = useRentalStore((s) => s.refreshActiveRental);

  const parkingSpots = useMapStore((s) => s.parkingSpots);

  const [bike, setBike] = useState<BikeDto | undefined>(undefined);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!isFocused) return;
    if (loadingActive) return;

    const controller = new AbortController();

    const refresh = async () => {
      try {
        await refreshActiveRental(controller.signal);
        const fresh = useRentalStore.getState().activeRental;

        if (!fresh && !redirectedRef.current) {
          redirectedRef.current = true;

          requestAnimationFrame(() => {
            navigation.replace("QrScanner");
          });

          return;
        }

        redirectedRef.current = false;
      } 
      catch (e: any) {
        if (isCanceled(e)) return;
        Alert.alert(com.Error, getApiErrorMessage(e));
      }
    };

    if (!activeRental) refresh();

    return () => {
      controller.abort();
    };
  }, [isFocused]);

  useEffect(() => {
    if (!activeRental) return;

    const controller = new AbortController();

    const fetchBike = async () => {
      try {
        const b = await bikesApi.getById(activeRental.bikeId, controller.signal);
        setBike(b);
      } 
      catch (e: any) {
        if (isCanceled(e)) return;
        Alert.alert(com.Error, getApiErrorMessage(e));
      }
    };

    fetchBike();

    return () => {
      controller.abort();
    };
  }, [activeRental]);

  useEffect(() => {
    if (!activeRental) return;

    const timer = setInterval(() => {
      setTick(x => x + 1)
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [activeRental]);

  const startMs = useMemo(() => {
    if (!activeRental) return 0;

    return new Date(activeRental.startAt).getTime();
  }, [activeRental]);

  const elapsedMs = useMemo(() => {
    if (!activeRental) return 0;

    return Date.now() - startMs;
  }, [activeRental, startMs, tick]);

  const liveCost = useMemo(() => {
    if (!activeRental || !bike) return 0;

    const hours = Math.ceil(elapsedMs / (1000 * 60 * 60));
    return hours * bike.pricePerHour;
  }, [activeRental, bike, elapsedMs]);

  const onReportIssue = () => {
    navigation.navigate("ReportIssue", { bikeId: activeRental!.bikeId });
  };

  const onFinish = () => {
    const insideSpotId = findInsideSpotId(bike!.location, parkingSpots);

    if (!insideSpotId) {
      Alert.alert(
        com.InvalidPlace,
        act.ErrInvalidPlace
      );
      return;
    }

    navigation.navigate("FinishRental", { bikeId: bike!.id });
  };

  if (loadingActive) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!activeRental || !bike) return;

  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: "600" }}>{act.Title}</Text>

      <Text>{act.Bike}: {activeRental.bikeId} {bike.type}</Text>
      <Text>{act.Duration}: {formatDurationFromMs(elapsedMs)}</Text>
      <Text>{act.CurrCost}: {liveCost.toFixed(2)}</Text>

      <View style={{ gap: 10, marginTop: 8 }}>
        <Button title={act.ReportIssue} onPress={onReportIssue} />
        <Button title={act.FinishRental} onPress={onFinish} />
      </View>
    </View>
  );
}
