import { useEffect, useRef, useState, useCallback } from "react";
import { View, Text, Button, Alert, ActivityIndicator } from "react-native";
import { BarcodeScanningResult, CameraView, useCameraPermissions } from "expo-camera";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RentalStackParamList } from "../../navigation/types";
import * as rentalApi from "../../services/rental-api";
import { useRentalStore } from "../../stores/rental-store";
import { getApiErrorMessage, isCanceled } from "../../util/api-error";
import { useMapStore } from "../../stores/map-store";
import { useTranslation } from "react-i18next";
import { commonTexts, qrScannerTexts } from "../../util/i18n-builder";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";

type Props = NativeStackScreenProps<RentalStackParamList, "QrScanner">;

export function QrScannerScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const qrr = qrScannerTexts(t);
  const com = commonTexts();
  
  const isFocused = useIsFocused();
  const handledRef = useRef(false);
  const alertOpenRef = useRef(false);
  
  const [permission, requestPermission] = useCameraPermissions();
  const startControllerRef = useRef<AbortController | undefined>(undefined);

  const setActiveRental = useRentalStore((s) => s.setActiveRental);
  const markDirty = useMapStore((s) => s.markDirty);

  const [scanned, setScanned] = useState<string | undefined>(undefined);
  const [busy, setBusy] = useState(false);

  useFocusEffect(
    useCallback(() => {
      return () => {
        startControllerRef.current?.abort();
        handledRef.current = false;
        alertOpenRef.current = false;
        setBusy(false);
        setScanned(undefined);
      };
    }, [])
  );


  useEffect(() => {
    return () => {
      startControllerRef.current?.abort();
    };
  }, []);  

  const clear = () => {
    handledRef.current = false;
    setScanned(undefined);
  };

  const onBarcodeScanner = (result: BarcodeScanningResult) => {
    if (!isFocused) return;
    if (busy) return;
    if (scanned) return; 
    if (handledRef.current) return;
    if (alertOpenRef.current) return;
    
    handledRef.current = true;
    setScanned(result.data);
    
    alertOpenRef.current = true;
    Alert.alert(
      com.AreYouSure,
      `${qrr.Scanned}: ${result.data}`,
      [
        {
          text: com.No,
          style: "cancel",
          onPress: () =>  { 
            clear();
            alertOpenRef.current = false;
          },
        },
        {
          text: com.Yes,
          onPress: () => {
            startRental(result.data);
            alertOpenRef.current = false;
          }
        },
      ]
    );
  };

  const startRental = async (bikeId: string) => {
    if (!bikeId) {
      alertOpenRef.current = true;
      Alert.alert(
        com.UnknownQR,
        qrr.UnknownQR,
        [ 
          { 
            text: com.Ok, 
            onPress: () => {  
              clear();
              alertOpenRef.current = false;
            } 
          } 
        ]
      );

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

      alertOpenRef.current = true;
      Alert.alert(
        com.Error, 
        getApiErrorMessage(e),
        [
          {
            text: com.Ok, 
            onPress: () => { 
              clear(); 
              alertOpenRef.current = false;
            } 
          }
        ]
      );
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
        <Text>{qrr.CameraPermission}</Text>
        <Button title={qrr.AllowCamera} onPress={requestPermission} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <CameraView style={{ flex: 1 }} onBarcodeScanned={isFocused ? onBarcodeScanner : undefined}
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}/>

      <View style={{ padding: 12, gap: 8 }}>
        <Text>{qrr.ScanQR}</Text>

        {busy && <ActivityIndicator />}

        {scanned && <Button title={qrr.ScanAgain} disabled={busy} onPress={clear}/>}
      </View>
    </View>
  );
}
