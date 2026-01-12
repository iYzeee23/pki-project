import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { useBikesStore } from "../../stores/bike-store";
import * as bikesApi from "../../services/bike-api";
import * as geocodeApi from "../../services/geocode-api";
import { getApiErrorMessage } from "../../util/api-error";
import { MapStackParamList } from "../../navigation/types";
import { getCached, keyOf, LOCATION_CACHE_MOBILE, setCached } from "@app/shared";

type Props = NativeStackScreenProps<MapStackParamList, "BikeDetails">;

export function BikeDetailsScreen({ route }: Props) {
  const { bikeId } = route.params;

  const localBike = useBikesStore(s => s.bikes.find(b => b.id === bikeId));
  const [bike, setBike] = useState(localBike);
  const [loadingBike, setLoadingBike] = useState(!localBike);
  
  const [locationLabel, setLocationLabel] = useState<string>("");
  const [loadingLocation, setLoadingLocation] = useState(false);

  useEffect(() => {
    if (localBike) {
      setBike(localBike);
      setLoadingBike(false);
      return;
    }

    const load = async () => {
      setLoadingBike(true);

      try {
        const b = await bikesApi.getById(bikeId);
        setBike(b);
      }
      catch (e) {
        Alert.alert("Error", getApiErrorMessage(e));
      }
      finally {
        setLoadingBike(false);
      }
    };

    load();
  }, [bikeId, localBike]);

  useEffect(() => {
    if (!bike) return;

    const { lng, lat } = bike.location;
    const key = keyOf({ lng: lng, lat: lat });
    const cached = getCached(LOCATION_CACHE_MOBILE, key);

    if (cached) {
      setLocationLabel(cached);
      setLoadingLocation(false);
      return;
    }

    setLoadingLocation(true);

    const loadLocationLabel = async () => {
      try {
        const label = await geocodeApi.reverse(lng, lat);
        setCached(LOCATION_CACHE_MOBILE, key, label);
        setLocationLabel(label);
      } 
      catch {
        setLocationLabel("Unknown location");
      }
      finally {
        setLoadingLocation(false);
      }
    };

    loadLocationLabel();
  }, [bike?.location.lat, bike?.location.lng]);

  const loading = loadingBike || loadingLocation;

  if (loading || !bike) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: "700" }}>Bike details</Text>

      <View style={{ borderWidth: 1, borderRadius: 12, padding: 12, gap: 8 }}>
        <Text><Text style={{ fontWeight: "700" }}>Id:</Text> {bike.id}</Text>
        <Text><Text style={{ fontWeight: "700" }}>Type:</Text> {bike.type}</Text>
        <Text><Text style={{ fontWeight: "700" }}>Price per hour:</Text> {bike.pricePerHour}</Text>
        <Text><Text style={{ fontWeight: "700" }}>Status:</Text> {bike.status}</Text>
        <Text><Text style={{ fontWeight: "700" }}>Location:</Text> {locationLabel}</Text>
        <Text><Text style={{ fontWeight: "700" }}>Lat:</Text> {bike.location.lat}</Text>
        <Text><Text style={{ fontWeight: "700" }}>Lng:</Text> {bike.location.lng}</Text>
      </View>
    </View>
  );
}
