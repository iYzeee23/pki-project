import React from "react";
import { View, Button } from "react-native";
import MapView, { Marker } from "react-native-maps";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { MapStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<MapStackParamList, "MapHome">;

export function MapScreen({ navigation }: Props) {
  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: 44.7866,
          longitude: 20.4489,
          latitudeDelta: 0.06,
          longitudeDelta: 0.06,
        }}
      >
        <Marker coordinate={{ latitude: 44.7866, longitude: 20.4489 }} title="Parking" />
        <Marker coordinate={{ latitude: 44.79, longitude: 20.44 }} title="Bicikl" />
      </MapView>

      <View style={{ padding: 12, gap: 8 }}>
        <Button
          title="ParkingDetails"
          onPress={() => navigation.navigate("ParkingDetails", { parkingId: "parking-1" })}
        />
        <Button
          title="BikeDetails"
          onPress={() => navigation.navigate("BikeDetails", { bikeId: "bike-1" })}
        />
      </View>
    </View>
  );
}
