import React, { useEffect, useRef, useState } from "react";
import { View, Text, Button, Alert, ActivityIndicator } from "react-native";
import { BarcodeScanningResult, CameraView, useCameraPermissions } from "expo-camera";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RentalStackParamList } from "../../navigation/types";
import * as rentalApi from "../../services/rental-api";
import { useRentalStore } from "../../stores/rental-store";
import { getApiErrorMessage, isCanceled } from "../../util/api-error";
import { useMapStore } from "../../stores/map-store";

type Props = NativeStackScreenProps<RentalStackParamList, "QrScanner">;

export function QrScannerScreen({ navigation }: Props) {
  const [permission, requestPermission] = useCameraPermissions();
  const startControllerRef = useRef<AbortController | undefined>(undefined);

  const setActiveRental = useRentalStore((s) => s.setActiveRental);
  const markDirty = useMapStore((s) => s.markDirty);

  const handledRef = useRef(false);
  const [scanned, setScanned] = useState<string | undefined>(undefined);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    return () => {
      startControllerRef.current?.abort();
    };
  }, []);  

  const canScan = !scanned && !busy;

  const clear = () => {
    handledRef.current = false;
    setScanned(undefined);
  };

  const onBarcodeScanner = (result: BarcodeScanningResult) => {
    if (handledRef.current) return;
    if (!canScan) return;
    
    handledRef.current = true;
    setScanned(result.data);

    Alert.alert(
      "Are you sure?",
      `Scanned: ${result.data}`,
      [
        {
          text: "No",
          style: "cancel",
          onPress: clear,
        },
        {
          text: "Yes",
          onPress: () => startRental(result.data),
        },
      ]
    );
  };

  const startRental = async (bikeId: string) => {
    if (!bikeId) {
      Alert.alert("Unknown QR", "QR doesn't contain valid bike identificator");
      clear();
      return;
    }

    startControllerRef.current?.abort();
    startControllerRef.current = new AbortController();

    const signal = startControllerRef.current.signal;

    setBusy(true);

    try {
      const rental = await rentalApi.start({
        bikeId: bikeId 
      }, signal);
      markDirty();
      setActiveRental(rental);
      navigation.replace("ActiveRental");
    } 
    catch (e: any) {
      if (isCanceled(e)) return;
      Alert.alert("Error", getApiErrorMessage(e));
      clear();
    } 
    finally {
      setBusy(false);
    }
  };

  if (!permission) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={{ flex: 1, padding: 16, gap: 12, justifyContent: "center" }}>
        <Text>This app requires camera permission in order to scan QR code</Text>
        <Button title="Allow camera" onPress={requestPermission} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <CameraView style={{ flex: 1 }} onBarcodeScanned={onBarcodeScanner}
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}/>

      <View style={{ padding: 12, gap: 8 }}>
        <Text>Scan the QR code</Text>

        {busy && <ActivityIndicator />}

        {scanned && <Button title="Scan again" disabled={busy} onPress={clear}/>}
      </View>
    </View>
  );
}
