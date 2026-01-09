import React from "react";
import { View, Text } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { MapStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<MapStackParamList, "BikeDetails">;

export function BikeDetailsScreen({ route }: Props) {
  const { bikeId } = route.params;

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: "600" }}>Bicikl: {bikeId}</Text>
      <Text>Detalji bicikla (tip/status/cena)</Text>
      <Text>Prijava kvara ide iz taba Iznajmljivanje (aktivna voznja)</Text>
    </View>
  );
}
