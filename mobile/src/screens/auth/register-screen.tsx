import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { View, Text } from "react-native";
import { AuthStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<AuthStackParamList, "Register">;

export function RegisterScreen({}: Props) {
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text>Registracija (sledeci korak: forma + poziv /auth/register)</Text>
    </View>
  );
}
