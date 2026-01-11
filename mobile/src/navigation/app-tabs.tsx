import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AppTabsParamList } from "./types";
import { MapStack } from "./map-stack";
import { RentalStack } from "./rental-stack";
import { ProfileStack } from "./profile-stack";
import { Ionicons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator<AppTabsParamList>();

export function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ size, color }) => {
          const mapIcon = "map-outline";
          const rentalIcon = "qr-code-outline";
          const profileIcon = "person-outline";

          const name = route.name === "MapTab" ? 
            mapIcon : route.name === "RentalTab" ?
              rentalIcon : profileIcon;

          return <Ionicons name={name as any} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="MapTab" component={MapStack} options={{ title: "Map" }} />
      <Tab.Screen name="RentalTab" component={RentalStack} options={{ title: "Rental" }} />
      <Tab.Screen name="ProfileTab" component={ProfileStack} options={{ title: "Profile" }} />
    </Tab.Navigator>
  );
}
