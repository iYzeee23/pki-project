import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MapStackParamList } from "./types";
import { MapScreen } from "../screens/map/map-screen";
import { ParkingDetailsScreen } from "../screens/map/parking-details-screen";
import { BikeDetailsScreen } from "../screens/map/bike-details-screen";

const Stack = createNativeStackNavigator<MapStackParamList>();

export function MapStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MapHome" component={MapScreen} options={{ title: "Map" }} />
      <Stack.Screen name="ParkingDetails" component={ParkingDetailsScreen} options={{ title: "Parking" }} />
      <Stack.Screen name="BikeDetails" component={BikeDetailsScreen} options={{ title: "Bike" }} />
    </Stack.Navigator>
  );
}
