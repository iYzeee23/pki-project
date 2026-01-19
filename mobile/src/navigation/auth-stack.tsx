import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthStackParamList } from "./types";
import { LoginScreen } from "../screens/auth/login-screen";
import { RegisterScreen } from "../screens/auth/register-screen";
import { commonTexts } from "../i18n/i18n-builder";

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthStack() {
  const com = commonTexts();
  
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} options={{ title: com.Login }} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ title: com.Registration }} />
    </Stack.Navigator>
  );
}
