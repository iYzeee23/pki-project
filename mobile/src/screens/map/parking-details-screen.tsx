import React from "react";
import { View, Text, Button } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { MapStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<MapStackParamList, "ParkingDetails">;

export function ParkingDetailsScreen({ route, navigation }: Props) {
  const { parkingId } = route.params;

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: "600" }}>Parking: {parkingId}</Text>
      <Text>Ovde ce doci lista bicikala na parkingu</Text>

      <Button
        title="Otvori BikeDetails"
        onPress={() => navigation.navigate("BikeDetails", { bikeId: "bike-7" })}
      />
    </View>
  );
}
