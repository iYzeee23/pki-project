import React, { useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Alert, View } from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { io, Socket } from "socket.io-client";

import { useMapStore } from "../../stores/map-store";
import { getApiErrorMessage, isCanceled } from "../../util/api-error";
import { API_BASE_URL } from "../../util/config";

import * as bikesApi from "../../services/bike-api";
import * as rentalsApi from "../../services/rental-api";
import { MapStackParamList } from "../../navigation/types";
import { BikeDto, LngLat, RentalDto, findInsideSpotId, nearestSpots } from "@app/shared";
import { useBikesStore } from "../../stores/bike-store";
import { useTranslation } from "react-i18next";
import { commonTexts, mapTexts } from "../../util/i18n-builder";

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
  const upsertBike = useBikesStore(s => s.upsertBike);
  
  const [activeRental, setActiveRental] = useState<RentalDto | undefined>(undefined);

  const mapRef = useRef<MapView | undefined>(undefined);
  const socketRef = useRef<Socket | undefined>(undefined);

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      setLoading(true);

      try {
        if (parkingSpots.length === 0)
          await loadParkingSpots(controller.signal);

        if (dirty) {
          const bikes = await bikesApi.list(controller.signal);
          const activeRental = await rentalsApi.active(controller.signal);

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
    const s = io(API_BASE_URL, { transports: ["websocket"] });
    socketRef.current = s;

    s.on("bike:updated", (dto: BikeDto) => {
      upsertBike(dto);
    });

    markDirty();

    return () => {
      s.disconnect();
      socketRef.current = undefined;
    };
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

  useEffect(() => {
    if (!mapRef.current) return;

    if (activeBike) {
      mapRef.current.animateToRegion(locationToMapCenter(activeBike.location), 350);
      return;
    }

    if (parkingSpots.length > 0) {
      mapRef.current.animateToRegion(locationToMapCenter(parkingSpots[0].location), 350);
      return;
    }

    mapRef.current.animateToRegion(defaultMapCenter(), 350);
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
            <Marker key={b.id} pinColor={pinColor} title={`${mapp.Bike} ${b.id}`} description={b.status}
              coordinate={{ latitude: b.location.lat, longitude: b.location.lng }}
              onPress={() => navigation.navigate("BikeDetails", { bikeId: b.id })} />
          );
        })}

        {isActiveMode && activeBike && activeNearestSpots.map(({ spot, distance }) => {
          const isInsideThis = activeInsideSpotId === spot.id;
          const pinColor = isInsideThis ? "orange" : "blue";

          return (
            <Marker key={spot.id} pinColor={pinColor} title={spot.name} description={`${Math.round(distance)}m`}
              coordinate={{ latitude: spot.location.lat, longitude: spot.location.lng }}
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

        {isActiveMode && activeBike && !activeInsideSpotId && (
          <Marker key={activeBike.id} pinColor="red" title={mapp.Active} description={`${mapp.Bike} ${activeBike.id}`}
            coordinate={{ latitude: activeBike.location.lat, longitude: activeBike.location.lng }}
            onPress={() => navigation.navigate("BikeDetails", { bikeId: activeBike.id })} />
        )}
      </MapView>
    </View>
  );
}
