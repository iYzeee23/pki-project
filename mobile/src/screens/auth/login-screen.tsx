import React, { useEffect, useRef, useState } from "react";
import { View, Text, TextInput, Button, TouchableOpacity } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../navigation/types";
import { useAuthStore } from "../../stores/auth-store";
import { getApiErrorMessage, isCanceled } from "../../util/api-error";

type Props = NativeStackScreenProps<AuthStackParamList, "Login">;

export function LoginScreen({ navigation }: Props) {
  const login = useAuthStore(s => s.login);

  const loginControllerRef = useRef<AbortController | undefined>(undefined);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    return () => {
      loginControllerRef.current?.abort();
    };
  }, []);

  const onLogin = async () => {
    loginControllerRef.current?.abort();
    loginControllerRef.current = new AbortController();

    const signal = loginControllerRef.current.signal;

    try {
      setError("");
      await login(username.trim(), password, signal);
    }
    catch (e: any) {
      if (isCanceled(e)) return;
      setError(getApiErrorMessage(e));
    }
  };

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text>Username</Text>
      <TextInput value={username} onChangeText={setUsername} autoCapitalize="none" style={{ borderWidth: 1, padding: 10 }} />

      <Text>Password</Text>
      <TextInput value={password} onChangeText={setPassword} secureTextEntry style={{ borderWidth: 1, padding: 10 }} />

      {error ? <Text style={{ color: "red" }}>{error}</Text> : null}

      <Button title="Login" onPress={onLogin} />
      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={{ textAlign: "center" }}>No account? Register</Text>
      </TouchableOpacity>
    </View>
  );
}
