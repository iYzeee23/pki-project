import { useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, View } from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useMapStore } from "../../stores/map-store";
import { MapStackParamList } from "../../navigation/types";
import { useBikesStore } from "../../stores/bike-store";
import { useTranslation } from "react-i18next";
import { commonTexts, mapTexts } from "../../i18n/i18n-builder";
import { findInsideSpotId, isCanceled, LngLat, nearestSpots, RentalDto } from "@app/shared";
import { bikeApi, rentalApi } from "../../util/services";
import { getApiErrorMessage } from "../../util/http";

function locationToMapCenter(loc: LngLat) {
  return {
    latitude: loc.lat,
    longitude: loc.lng,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  } as Region;
}

function defaultMapCenter() {
  return { 
    latitude: 44.8176,
    longitude: 20.4633,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05
  } as Region;
}

type Props = NativeStackScreenProps<MapStackParamList, "MapHome">;

export function MapScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const mapp = mapTexts(t);
  const com = commonTexts();

  const parkingSpots = useMapStore(s => s.parkingSpots);
  const loadParkingSpots = useMapStore(s => s.loadParkingSpots);

  const [loading, setLoading] = useState(true);
  const dirty = useMapStore(s => s.dirty);
  const clearDirty = useMapStore(s => s.clearDirty);
  const markDirty = useMapStore(s => s.markDirty);
  
  const bikes = useBikesStore(s => s.bikes);
  const setBikes = useBikesStore(s => s.setBikes);
  
  const [activeRental, setActiveRental] = useState<RentalDto | undefined>(undefined);

  const mapRef = useRef<MapView | undefined>(undefined);

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      setLoading(true);

      try {
        if (parkingSpots.length === 0)
          await loadParkingSpots(controller.signal);

        if (dirty) {
          const bikes = await bikeApi.list(controller.signal);
          const activeRental = await rentalApi.active(controller.signal);

          setBikes(bikes);
          setActiveRental(activeRental);
          clearDirty();
        }
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
  }, [parkingSpots, dirty]);

  useEffect(() => {
    markDirty();
  }, []);

  const isActiveMode = !!activeRental?.bikeId;

  const activeBike = useMemo(() => {
    if (!isActiveMode) return undefined;
    return bikes.find(b => b.id === activeRental.bikeId) ?? undefined;
  }, [activeRental, bikes]);

  const activeNearestSpots = useMemo(() => {
    if (!activeBike) return [];

    return nearestSpots(parkingSpots, activeBike.location);
  }, [parkingSpots, activeBike]);

  const nearestSpotKey = useMemo(
    () => activeNearestSpots.map(ns => ns.spot.id).join(","),
    [activeNearestSpots]
  );

  const spotRenderVersion = useRef(0);
  const prevNearestKey = useRef(nearestSpotKey);
  if (prevNearestKey.current !== nearestSpotKey) {
    prevNearestKey.current = nearestSpotKey;
    spotRenderVersion.current += 1;
  }

  const activeInsideSpotId = useMemo(() => {
    if (!activeBike) return undefined;
    
    return findInsideSpotId(activeBike.location, parkingSpots);
  }, [activeBike, parkingSpots]);

  const defaultVisibleBikes = useMemo(() => {
    if (isActiveMode) return [];

    return bikes.filter(b => {
      if (b.status === "Busy") return false;

      const insideSpotId = findInsideSpotId(b.location, parkingSpots);
      if (insideSpotId) return false;

      return true;
    });
  }, [bikes, parkingSpots, isActiveMode]);

  const visibleBikeIds = useMemo(
    () => defaultVisibleBikes.map(b => b.id).sort().join(","),
    [defaultVisibleBikes]
  );

  const bikeRenderVersion = useRef(0);
  const prevVisibleIds = useRef(visibleBikeIds);
  if (prevVisibleIds.current !== visibleBikeIds) {
    prevVisibleIds.current = visibleBikeIds;
    bikeRenderVersion.current += 1;
  }

  useEffect(() => {
    if (!mapRef.current) return;

    const target = activeBike
      ? locationToMapCenter(activeBike.location)
      : parkingSpots.length > 0
        ? locationToMapCenter(parkingSpots[0].location)
        : defaultMapCenter();

    const timer = setTimeout(() => {
      mapRef.current?.animateToRegion(target, 350);
    }, 150);

    return () => clearTimeout(timer);
  }, [activeBike, parkingSpots]);

  if (loading || parkingSpots.length === 0) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const initialRegion: Region = activeBike ? 
    locationToMapCenter(activeBike.location) : parkingSpots.length > 0 ?
    locationToMapCenter(parkingSpots[0].location) : defaultMapCenter();
    
  return (
    <View style={{ flex: 1 }}>
      <MapView ref={r => { mapRef.current = r ?? undefined; }} style={{ flex: 1 }} initialRegion={initialRegion}>
        {!isActiveMode && parkingSpots.map(ps => {
          const pinColor = "blue";
          
          return (
            <Marker key={ps.id} pinColor={pinColor} title={ps.name}
              coordinate={{ latitude: ps.location.lat, longitude: ps.location.lng }}
              onPress={() => navigation.navigate("ParkingDetails", { spotId: ps.id, isActiveMode: false })} />
          );
        })}

        {!isActiveMode && defaultVisibleBikes.map(b => {
          const pinColor = b.status === "Available" ? "green" : "red";

          return (
            <Marker key={`${b.id}-${bikeRenderVersion.current}`} pinColor={pinColor}
              title={`${mapp.Bike} ${b.id}`} description={b.status}
              coordinate={{ latitude: b.location.lat, longitude: b.location.lng }}
              onPress={() => navigation.navigate("BikeDetails", { bikeId: b.id })} />
          );
        })}

        {isActiveMode && activeBike && activeNearestSpots.map(({ spot, distance }) => {
          const isInsideThis = activeInsideSpotId === spot.id;
          const pinColor = isInsideThis ? "orange" : "blue";

          return (
            <Marker key={`${spot.id}-${spotRenderVersion.current}`} pinColor={pinColor}
              title={spot.name} description={`${Math.round(distance)}m`}
              coordinate={{ latitude: spot.location.lat, longitude: spot.location.lng }}
              zIndex={2}
              onPress={() =>
                navigation.navigate("ParkingDetails", {
                  spotId: spot.id,
                  distance: distance,
                  isActiveMode: true,
                  activeBikeId: activeBike.id,
                })
              } />
          );
        })}

        {isActiveMode && activeBike && (() => {
          const hidden = !!activeInsideSpotId;
          return (
            <Marker key={activeBike.id} pinColor="red"
              title={mapp.Active} description={`${mapp.Bike} ${activeBike.id}`}
              coordinate={hidden
                ? { latitude: 0, longitude: 0 }
                : { latitude: activeBike.location.lat, longitude: activeBike.location.lng }}
              zIndex={hidden ? -1 : 1}
              opacity={hidden ? 0 : 1}
              onPress={hidden ? undefined : () => navigation.navigate("BikeDetails", { bikeId: activeBike.id })} />
          );
        })()}
      </MapView>

      <View style={styles.legendContainer}>
        <Text style={styles.legendTitle}>{mapp.Legend}</Text>
        {isActiveMode ? (
          <>
            <LegendItem color="blue" label={mapp.NearbyParking} />
            <LegendItem color="orange" label={mapp.InsideParking} />
            <LegendItem color="red" label={mapp.ActiveBike} />
          </>
        ) : (
          <>
            <LegendItem color="blue" label={mapp.ParkingSpot} />
            <LegendItem color="green" label={mapp.AvailableBike} />
            <LegendItem color="red" label={mapp.UnavailableBike} />
          </>
        )}
      </View>
    </View>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={styles.legendLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  legendContainer: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "rgba(255, 255, 255, 0.92)",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  legendTitle: {
    fontWeight: "700",
    fontSize: 13,
    marginBottom: 4,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 2,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendLabel: {
    fontSize: 12,
  },
});
