import React, { useMemo } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useMapStore } from "../../stores/map-store";
import { useBikesStore } from "../../stores/bike-store";
import { MapStackParamList } from "../../navigation/types";
import { BikeDto, haversineMeters, PARKING_RADIUS_M } from "@app/shared";

function EmptyState() {
  return (
    <View style={{ gap: 10 }}>
      <Text>No bikes in this parking spot</Text>
    </View>
  );
}

type BikeListProps = {
  bikesInThisSpot: BikeDto[];
  navigation: any;
};

function BikeList({bikesInThisSpot, navigation}: BikeListProps) {
  return (
    <View style={{ gap: 10 }}>
      <Text style={{ fontWeight: "700" }}>Bikes in this parking spot</Text>

      {bikesInThisSpot.length === 0 ? <EmptyState /> : (
        bikesInThisSpot.map(b => (
          <TouchableOpacity key={b.id} onPress={() => navigation.navigate("BikeDetails", { bikeId: b.id })}
            style={{ borderWidth: 1, borderRadius: 12, padding: 12 }}>
            <Text><Text style={{ fontWeight: "700" }}>Bike:</Text> {b.id}</Text>
            <Text><Text style={{ fontWeight: "700" }}>Status:</Text> {b.status}</Text>
            <Text><Text style={{ fontWeight: "700" }}>Type:</Text> {b.type}</Text>
          </TouchableOpacity>
        ))
      )}
    </View>
  );
}

type Props = NativeStackScreenProps<MapStackParamList, "ParkingDetails">;

export function ParkingDetailsScreen({ route, navigation }: Props) {
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
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: "700" }}>{spot.name}</Text>

      <View style={{ borderWidth: 1, borderRadius: 12, padding: 12, gap: 8 }}>
        <Text><Text style={{ fontWeight: "700" }}>Id:</Text> {spot.id}</Text>
        <Text><Text style={{ fontWeight: "700" }}>Lat:</Text> {spot.location.lat}</Text>
        <Text><Text style={{ fontWeight: "700" }}>Lng:</Text> {spot.location.lng}</Text>

        {(distance ?? 0) > 0 && (
          <Text><Text style={{ fontWeight: "700" }}>Distance:</Text> {Math.round(distance!)}m</Text>
        )}

        {isActiveMode && isActiveBikeInsideThisSpot && (
          <Text>You're already inside parking spot</Text>
        )}
      </View>

      {!isActiveMode && <BikeList bikesInThisSpot={bikesInThisSpot} navigation={navigation} />}
    </View>
  );
}
