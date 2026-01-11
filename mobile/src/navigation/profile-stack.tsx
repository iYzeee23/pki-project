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
      <Stack.Screen name="ProfileHome" component={ProfileScreen} options={{ title: "Profile" }} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: "Edit profile" }} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} options={{ title: "Change password" }} />
      <Stack.Screen name="RentalHistory" component={RentalHistoryScreen} options={{ title: "Rental history" }} />
      <Stack.Screen name="RentalDetails" component={RentalDetailsScreen} options={{ title: "Rental details" }} />
    </Stack.Navigator>
  );
}
