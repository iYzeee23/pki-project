import React, { useMemo, useState } from "react";
import { View, Text, Button, Alert } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RentalStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<RentalStackParamList, "QrScanner">;

export function QrScannerScreen({ navigation }: Props) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState<string | null>(null);

  const canScan = useMemo(() => !scanned, [scanned]);

  if (!permission) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Trazim dozvolu za kameru</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={{ flex: 1, padding: 16, gap: 12, justifyContent: "center" }}>
        <Text>Dozvola za kameru je potrebna za QR skeniranje</Text>
        <Button title="Dozvoli kameru" onPress={requestPermission} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <CameraView
        style={{ flex: 1 }}
        onBarcodeScanned={(result) => {
          if (!canScan) return;

          setScanned(result.data);

          Alert.alert(
            "Da li ste sigurni?", 
            `Skenirano: ${result.data}`, 
            [
              { text: "Ne", style: "cancel", onPress: () => setScanned(null) },
              { text: "Da", onPress: () => navigation.goBack() },
            ]
          );
        }}
      />

      <View style={{ padding: 12, gap: 8 }}>
        <Text>Usmeri kameru ka QR kodu</Text>
        {scanned ? <Button title="Skeniraj ponovo" onPress={() => setScanned(null)} /> : null}
      </View>
    </View>
  );
}
