import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MapStackParamList } from "./types";
import { MapScreen } from "../screens/map/map-screen";
import { ParkingDetailsScreen } from "../screens/map/parking-details-screen";
import { BikeDetailsScreen } from "../screens/map/bike-details-screen";
import { commonTexts } from "../i18n/i18n-builder";

const Stack = createNativeStackNavigator<MapStackParamList>();

export function MapStack() {
  const com = commonTexts();
    
  return (
    <Stack.Navigator>
      <Stack.Screen name="MapHome" component={MapScreen} options={{ title: com.Map }} />
      <Stack.Screen name="ParkingDetails" component={ParkingDetailsScreen} options={{ title: com.Parking }} />
      <Stack.Screen name="BikeDetails" component={BikeDetailsScreen} options={{ title: com.Bike }} />
    </Stack.Navigator>
  );
}
