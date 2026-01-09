import React, { useState } from "react";
import { View, Text, Button, Alert } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RentalStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<RentalStackParamList, "ActiveRental">;

export function ActiveRentalScreen({ navigation }: Props) {
  const [active, setActive] = useState(false);

  if (!active) {
    return (
      <View style={{ flex: 1, padding: 16, gap: 12 }}>
        <Text style={{ fontSize: 18, fontWeight: "600" }}>Nema aktivnog iznajmljivanja</Text>

        <Button title="Skeniraj QR" onPress={() => navigation.navigate("QrScanner")} />
        <Button title="Postavi aktivno iznajmljivanje" onPress={() => setActive(true)} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: "600" }}>Aktivno iznajmljivanje</Text>
      <Text>Timer + cena (dolazi posle)</Text>

      <Button
        title="Prijavi neispravnost"
        onPress={() => navigation.navigate("ReportIssue", { bikeId: "bike-1", rentalId: "rental-1" })}
      />

      <Button
        title="Zavrsi voznju"
        onPress={() => {
          Alert.alert(
            "Ovo je validna lokacija. Da li ste sigurni?",
            "",
            [
              { text: "Ne", style: "cancel" },
              {
                text: "Da",
                onPress: () => navigation.navigate("PhotoUpload", { purpose: "RETURN", rentalId: "rental-1", bikeId: "bike-1" }),
              },
            ]
          );
        }}
      />

      <Button title="Ocisti aktivno iznajmljivanje" onPress={() => setActive(false)} />
    </View>
  );
}
