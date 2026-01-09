import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ProfileStackParamList } from "./types";
import { ProfileScreen } from "../screens/profile/profile-screen";
import { EditProfileScreen } from "../screens/profile/edit-profile-screen";
import { ChangePasswordScreen } from "../screens/profile/change-password-screen";
import { RentalHistoryScreen } from "../screens/profile/rental-history-screen";
import { RentalDetailsScreen } from "../screens/profile/rental-details-screen";

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export function ProfileStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ProfileHome" component={ProfileScreen} options={{ title: "Profil" }} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: "Izmena podataka" }} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} options={{ title: "Promena lozinke" }} />
      <Stack.Screen name="RentalHistory" component={RentalHistoryScreen} options={{ title: "Istorija iznajmljivanja" }} />
      <Stack.Screen name="RentalDetails" component={RentalDetailsScreen} options={{ title: "Detalji iznajmljivanja" }} />
    </Stack.Navigator>
  );
}
