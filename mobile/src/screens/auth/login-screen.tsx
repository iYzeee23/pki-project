import React, { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../navigation/types";
import { useAuthStore } from "../../stores/auth-store";

type Props = NativeStackScreenProps<AuthStackParamList, "Login">;

export function LoginScreen({ navigation }: Props) {
  const login = useAuthStore(s => s.login);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onLogin = async () => {
    try {
      setError("");
      await login(username.trim(), password);
    }
    catch (e: any) {
      setError(e?.message ?? "Neuspesna prijava");
    }
  };

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text>Korisnicko ime</Text>
      <TextInput value={username} onChangeText={setUsername} autoCapitalize="none" style={{ borderWidth: 1, padding: 10 }} />

      <Text>Lozinka</Text>
      <TextInput value={password} onChangeText={setPassword} secureTextEntry style={{ borderWidth: 1, padding: 10 }} />

      {error ? <Text style={{ color: "red" }}>{error}</Text> : null}

      <Button title="Prijavi se" onPress={onLogin} />
      <Button title="Registracija" onPress={() => navigation.navigate("Register")} />
    </View>
  );
}
