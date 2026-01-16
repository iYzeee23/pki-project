import { View, ActivityIndicator } from "react-native";
import { AuthStack } from "./auth-stack";
import { AppTabs } from "./app-tabs";
import { useAuthStore } from "../stores/auth-store";
import { connectSocket, disconnectSocket } from "../util/socket";
import { useEffect } from "react";

export function RootNavigator() {
  const token = useAuthStore(s => s.token);
  const isHydrated = useAuthStore(s => s.isHydrated);

  useEffect(() => {
    if (!isHydrated) return;

    if (token) connectSocket();
    else disconnectSocket();

    return () => disconnectSocket();
  }, [token, isHydrated]);

  if (!isHydrated) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return token ? <AppTabs /> : <AuthStack />;
}
