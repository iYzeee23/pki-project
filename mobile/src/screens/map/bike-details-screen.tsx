import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useBikesStore } from "../../stores/bike-store";
import { MapStackParamList } from "../../navigation/types";
import { useTranslation } from "react-i18next";
import { bikeDetailsTexts, commonTexts } from "../../i18n/i18n-builder";
import i18n from "../../i18n";
import { bikeApi, geocodeApi } from "../../util/services";
import { BikeStatus, getCached, isCanceled, keyOf, LOCATION_CACHE_MOBILE, setCached } from "@app/shared";
import { getApiErrorMessage } from "../../util/http";

const GREEN = "#2E7D32";

const STATUS_COLORS: Record<BikeStatus, string> = {
  Available: "#2E7D32",
  Busy: "#d32f2f",
  Maintenance: "#f9a825",
  Off: "#757575",
};

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
      <Text style={styles.title}>{bikk.Details}</Text>

      <View style={[styles.infoCard, { borderLeftWidth: 4, borderLeftColor: STATUS_COLORS[bike.status] }]}>
        <Text style={styles.infoText}>
          <Text style={styles.bold}>{bikk.Id}:</Text> {bike.id}
        </Text>
        <Text style={styles.infoText}>
          <Text style={styles.bold}>{bikk.Type}:</Text> {bike.type}
        </Text>
        <Text style={styles.infoText}>
          <Text style={styles.bold}>{bikk.Price}:</Text> {bike.pricePerHour}
        </Text>
        <Text style={styles.infoText}>
          <Text style={styles.bold}>{bikk.Status}:</Text> {bike.status}
        </Text>
        <Text style={styles.infoText}>
          <Text style={styles.bold}>{bikk.Location}:</Text> {locationLabel}
        </Text>
        <Text style={styles.infoText}>
          <Text style={styles.bold}>{bikk.Lat}:</Text> {bike.location.lat}
        </Text>
        <Text style={styles.infoText}>
          <Text style={styles.bold}>{bikk.Lng}:</Text> {bike.location.lng}
        </Text>
      </View>
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
    paddingLeft: 14,
    gap: 6,
  },
  infoText: {
    fontSize: 15,
    color: "#333",
    lineHeight: 22,
  },
  bold: {
    fontWeight: "700",
  },
});
