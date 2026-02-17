import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ProfileStackParamList } from "../../navigation/types";
import { useTranslation } from "react-i18next";
import { commonTexts, rentalDetailsTexts } from "../../i18n/i18n-builder";
import { BikeDto, formatDateTime, formatDurationFromStartEnd, isCanceled, RentalDto } from "@app/shared";
import { bikeApi, rentalApi } from "../../util/services";
import { getApiErrorMessage } from "../../util/http";

const GREEN = "#2E7D32";

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
        const r = await rentalApi.getById(rentalId, controller.signal);
        setRental(r);

        const b = await bikeApi.getById(r.bikeId, controller.signal);
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
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={GREEN} />
      </View>
    );
  }

  const startTime = formatDateTime(rental.startAt);
  const endTime = formatDateTime(rental.endAt!);
  const duration = formatDurationFromStartEnd(rental.startAt, rental.endAt!);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>{rent.Title}</Text>

      <View style={styles.divider} />

      <View style={styles.card}>
        <InfoRow label={rent.BikeId} value={rental.bikeId} />
        <InfoRow label={rent.BikeType} value={bike.type} />
        <InfoRow label={rent.StartTime} value={startTime} />
        <InfoRow label={rent.EndTime} value={endTime} />
        <InfoRow label={rent.Price} value={String(bike.pricePerHour)} />
        <InfoRow label={rent.Duration} value={duration} />
        <InfoRow label={rent.TotalCost} value={String(rental.totalCost)} highlight />
        {rental.description ? (
          <InfoRow label={rent.Description} value={rental.description} />
        ) : null}
      </View>
    </ScrollView>
  );
}

function InfoRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={[styles.infoValue, highlight && styles.highlightValue]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginTop: 12,
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#555",
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    color: "#333",
    flex: 1,
    textAlign: "right",
  },
  highlightValue: {
    color: GREEN,
    fontWeight: "700",
  },
});
