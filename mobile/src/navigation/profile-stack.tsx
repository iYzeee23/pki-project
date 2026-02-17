import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ProfileStackParamList } from "./types";
import { ProfileScreen } from "../screens/profile/profile-screen";
import { EditProfileScreen } from "../screens/profile/edit-profile-screen";
import { ChangePasswordScreen } from "../screens/profile/change-password-screen";
import { RentalHistoryScreen } from "../screens/profile/rental-history-screen";
import { RentalDetailsScreen } from "../screens/profile/rental-details-screen";
import { commonTexts } from "../i18n/i18n-builder";

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export function ProfileStack() {
  const com = commonTexts();
    
  return (
    <Stack.Navigator screenOptions={{
      headerShadowVisible: false,
      headerStyle: { backgroundColor: "#fff" },
      headerTitle: "",
      headerTintColor: "#333",
    }}>
      <Stack.Screen name="ProfileHome" component={ProfileScreen} options={{ headerShown: false }} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
      <Stack.Screen name="RentalHistory" component={RentalHistoryScreen} />
      <Stack.Screen name="RentalDetails" component={RentalDetailsScreen} />
    </Stack.Navigator>
  );
}
