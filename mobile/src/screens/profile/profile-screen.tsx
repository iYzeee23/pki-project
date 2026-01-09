import React from "react";
import { View, Text, Button } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ProfileStackParamList } from "../../navigation/types";
import { useAuthStore } from "../../stores/auth-store";

type Props = NativeStackScreenProps<ProfileStackParamList, "ProfileHome">;

export function ProfileScreen({ navigation }: Props) {
  const logout = useAuthStore((s) => s.logout);

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: "600" }}>Profil</Text>
      <Button title="Izmeni podatke" onPress={() => navigation.navigate("EditProfile")} />
      <Button title="Promeni lozinku" onPress={() => navigation.navigate("ChangePassword")} />
      <Button title="Istorija" onPress={() => navigation.navigate("RentalHistory")} />
      <Button title="Odjava" onPress={() => logout()} />
    </View>
  );
}
