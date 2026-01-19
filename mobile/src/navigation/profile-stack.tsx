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
    <Stack.Navigator>
      <Stack.Screen name="ProfileHome" component={ProfileScreen} options={{ title: com.Profile }} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: com.EditProfile }} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} options={{ title: com.ChangePassword }} />
      <Stack.Screen name="RentalHistory" component={RentalHistoryScreen} options={{ title: com.RentalHistory }} />
      <Stack.Screen name="RentalDetails" component={RentalDetailsScreen} options={{ title: com.RentalDetails }} />
    </Stack.Navigator>
  );
}
