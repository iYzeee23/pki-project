import React from "react";
import { View, ActivityIndicator } from "react-native";
import { AuthStack } from "./auth-stack";
import { AppTabs } from "./app-tabs";
import { useAuthStore } from "../stores/auth-store";

export function RootNavigator() {
  const token = useAuthStore(s => s.token);
  const isHydrated = useAuthStore(s => s.isHydrated);

  if (!isHydrated) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return token ? <AppTabs /> : <AuthStack />;
}
