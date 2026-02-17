import { useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RentalStackParamList } from "../../navigation/types";
import { useRentalStore } from "../../stores/rental-store";
import { useMapStore } from "../../stores/map-store";
import { useTranslation } from "react-i18next";
import { activeRentalTexts, commonTexts } from "../../i18n/i18n-builder";
import { BikeDto, findInsideSpotId, formatDurationFromMs, isCanceled } from "@app/shared";
import { bikeApi } from "../../util/services";
import { getApiErrorMessage } from "../../util/http";
import { useBikesStore } from "../../stores/bike-store";

const GREEN = "#2E7D32";

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

  const storeBike = useBikesStore((s) =>
    activeRental ? s.bikes.find(b => b.id === activeRental.bikeId) : undefined
  );

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
        const b = await bikeApi.getById(activeRental.bikeId, controller.signal);
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
    if (storeBike) setBike(storeBike);
  }, [storeBike]);

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
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={GREEN} />
      </View>
    );
  }

  if (!activeRental || !bike) return;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{act.Title}</Text>

        <View style={styles.infoSection}>
          <Text style={styles.infoText}>
            <Text style={styles.bold}>{act.Bike}:</Text> {activeRental.bikeId}
          </Text>
          <Text style={styles.infoText}>
            <Text style={styles.bold}>{act.Duration}:</Text> {formatDurationFromMs(elapsedMs)}
          </Text>
          <Text style={styles.infoText}>
            <Text style={styles.bold}>{act.CurrCost}:</Text> {liveCost.toFixed(2)}
          </Text>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity onPress={onReportIssue}>
            <Text style={styles.actionLink}>{act.ReportIssue}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onFinish}>
            <Text style={styles.actionLink}>{act.FinishRental}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 16,
  },
  infoSection: {
    gap: 6,
    marginBottom: 40,
  },
  infoText: {
    fontSize: 15,
    color: "#333",
    lineHeight: 22,
  },
  bold: {
    fontWeight: "700",
  },
  actionsContainer: {
    alignItems: "center",
    gap: 12,
  },
  actionLink: {
    fontSize: 16,
    fontWeight: "600",
    color: GREEN,
    textDecorationLine: "underline",
  },
});
