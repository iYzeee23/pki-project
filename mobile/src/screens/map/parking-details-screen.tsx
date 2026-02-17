import { useMemo } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useMapStore } from "../../stores/map-store";
import { useBikesStore } from "../../stores/bike-store";
import { MapStackParamList } from "../../navigation/types";
import { useTranslation } from "react-i18next";
import { parkingDetailsTexts } from "../../i18n/i18n-builder";
import { BikeDto, BikeStatus, haversineMeters, PARKING_RADIUS_M } from "@app/shared";

const GREEN = "#2E7D32";

const STATUS_COLORS: Record<BikeStatus, string> = {
  Available: "#2E7D32",
  Busy: "#d32f2f",
  Maintenance: "#f9a825",
  Off: "#757575",
};

function EmptyState({park}: any) {
  return (
    <Text style={styles.emptyText}>{park.NoBikes}</Text>
  );
}

type BikeListProps = {
  bikesInThisSpot: BikeDto[];
  navigation: any;
  park: any;
};

function BikeList({bikesInThisSpot, navigation, park}: BikeListProps) {
  return (
    <View style={styles.bikeSection}>
      <Text style={styles.bikeSectionTitle}>{park.BikesIn}</Text>

      {bikesInThisSpot.length === 0 ? <EmptyState park={park} /> : (
        bikesInThisSpot.map(b => (
          <TouchableOpacity
            key={b.id}
            onPress={() => navigation.navigate("BikeDetails", { bikeId: b.id })}
            style={[styles.bikeCard, { borderLeftColor: STATUS_COLORS[b.status] }]}
          >
            <Text style={styles.bikeInfoText}>
              <Text style={styles.bold}>{park.Bike}:</Text> {b.id}
            </Text>
            <Text style={styles.bikeInfoText}>
              <Text style={styles.bold}>{park.Status}:</Text> {b.status}
            </Text>
            <Text style={styles.bikeInfoText}>
              <Text style={styles.bold}>{park.Type}:</Text> {b.type}
            </Text>
          </TouchableOpacity>
        ))
      )}
    </View>
  );
}

type Props = NativeStackScreenProps<MapStackParamList, "ParkingDetails">;

export function ParkingDetailsScreen({ route, navigation }: Props) {
  const { t } = useTranslation();
  const park = parkingDetailsTexts(t);

  const { spotId, distance, isActiveMode, activeBikeId } = route.params;

  const spot = useMapStore(s => s.parkingSpots.find(p => p.id === spotId));
  const bikes = useBikesStore(s => s.bikes);

  const bikesInThisSpot = useMemo(() => {
    if (!spot) return [];

    return bikes.filter(bike => {
      if (bike.status === "Busy") return false;

      const d = haversineMeters(bike.location, spot.location);
      return d <= PARKING_RADIUS_M;
    });
  }, [bikes, spot]);

  const isActiveBikeInsideThisSpot = useMemo(() => {
    if (!isActiveMode || !spot) return false;

    const activeBike = bikes.find(b => b.id === activeBikeId);
    if (!activeBike) return false;

    const d = haversineMeters(activeBike.location, spot.location);
    return d <= PARKING_RADIUS_M;
  }, [isActiveMode, spot, activeBikeId, bikes]);

  if (!spot) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={GREEN} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      <Text style={styles.title}>Parking: {spot.name}</Text>

      <View style={styles.infoCard}>
        <Text style={styles.infoText}>
          <Text style={styles.bold}>{park.Id}:</Text> {spot.id}
        </Text>
        <Text style={styles.infoText}>
          <Text style={styles.bold}>{park.Lat}:</Text> {spot.location.lat}
        </Text>
        <Text style={styles.infoText}>
          <Text style={styles.bold}>{park.Lng}:</Text> {spot.location.lng}
        </Text>

        {(distance ?? 0) > 0 && (
          <Text style={styles.infoText}>
            <Text style={styles.bold}>{park.Distance}:</Text> {Math.round(distance!)}m
          </Text>
        )}

        {isActiveMode && isActiveBikeInsideThisSpot && (
          <Text style={styles.alreadyInsideText}>{park.AlreadyInside}</Text>
        )}
      </View>

      {!isActiveMode && <BikeList bikesInThisSpot={bikesInThisSpot} navigation={navigation} park={park} />}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    paddingHorizontal: 28,
    paddingTop: 24,
    paddingBottom: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 16,
  },
  infoCard: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 16,
    gap: 6,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 15,
    color: "#333",
    lineHeight: 22,
  },
  bold: {
    fontWeight: "700",
  },
  alreadyInsideText: {
    fontSize: 14,
    color: GREEN,
    fontWeight: "600",
    marginTop: 4,
  },
  bikeSection: {
    gap: 12,
  },
  bikeSectionTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#333",
  },
  bikeCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#757575",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    padding: 14,
    gap: 4,
    backgroundColor: "#fafafa",
  },
  bikeInfoText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  emptyText: {
    fontSize: 14,
    color: "#888",
    fontStyle: "italic",
  },
});
