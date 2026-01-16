import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useBikesStore } from "../../stores/bike-store";
import { MapStackParamList } from "../../navigation/types";
import { useTranslation } from "react-i18next";
import { bikeDetailsTexts, commonTexts } from "../../util/i18n-builder";
import i18n from "../../i18n";
import { bikeApi, geocodeApi } from "../../util/services";
import { getCached, isCanceled, keyOf, LOCATION_CACHE_MOBILE, setCached } from "@app/shared";
import { getApiErrorMessage } from "../../util/http";

type Props = NativeStackScreenProps<MapStackParamList, "BikeDetails">;

export function BikeDetailsScreen({ route }: Props) {
  const { t } = useTranslation();
  const bikk = bikeDetailsTexts(t);
  const com = commonTexts();
  const uiLang = i18n.language;
  
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

    const controller = new AbortController();

    const load = async () => {
      setLoadingBike(true);

      try {
        const b = await bikeApi.getById(bikeId, controller.signal);
        setBike(b);
      }
      catch (e: any) {
        if (isCanceled(e)) return;
        Alert.alert(com.Error, getApiErrorMessage(e));
      }
      finally {
        setLoadingBike(false);
      }
    };

    load();

    return () => {
      controller.abort();
    };
  }, [bikeId, localBike]);

  useEffect(() => {
    if (!bike) return;

    const { lng, lat } = bike.location;
    const key = keyOf({ lng: lng, lat: lat }, uiLang );
    const cached = getCached(LOCATION_CACHE_MOBILE, key);

    if (cached) {
      setLocationLabel(cached);
      setLoadingLocation(false);
      return;
    }

    setLoadingLocation(true);

    const controller = new AbortController();

    const loadLocationLabel = async () => {
      try {
        const label = await geocodeApi.reverse(lng, lat, uiLang, controller.signal);
        setCached(LOCATION_CACHE_MOBILE, key, label);
        setLocationLabel(label);
      } 
      catch (e: any) {
        if (isCanceled(e)) return;
        setLocationLabel(bikk.ErrLocation);
      }
      finally {
        setLoadingLocation(false);
      }
    };

    loadLocationLabel();

    return () => {
      controller.abort();
    };
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
      <Text style={{ fontSize: 22, fontWeight: "700" }}>{bikk.Details}</Text>

      <View style={{ borderWidth: 1, borderRadius: 12, padding: 12, gap: 8 }}>
        <Text><Text style={{ fontWeight: "700" }}>{bikk.Id}:</Text> {bike.id}</Text>
        <Text><Text style={{ fontWeight: "700" }}>{bikk.Type}:</Text> {bike.type}</Text>
        <Text><Text style={{ fontWeight: "700" }}>{bikk.Price}:</Text> {bike.pricePerHour}</Text>
        <Text><Text style={{ fontWeight: "700" }}>{bikk.Status}:</Text> {bike.status}</Text>
        <Text><Text style={{ fontWeight: "700" }}>{bikk.Location}:</Text> {locationLabel}</Text>
        <Text><Text style={{ fontWeight: "700" }}>{bikk.Lat}:</Text> {bike.location.lat}</Text>
        <Text><Text style={{ fontWeight: "700" }}>{bikk.Lng}:</Text> {bike.location.lng}</Text>
      </View>
    </View>
  );
}
