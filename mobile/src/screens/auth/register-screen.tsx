import React, { useEffect, useRef, useState } from "react";
import { Alert, Button, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { getApiErrorMessage, isCanceled } from "../../util/api-error";
import { pickSingleImage, UploadFile } from "../../util/image-picker";
import * as authApi from "../../services/auth-api";
import { useAuthStore } from "../../stores/auth-store";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../navigation/types";
import { DEFAULT_PROFILE_PICTURE_RESOLVED } from "../../util/config";

type Props = NativeStackScreenProps<AuthStackParamList, "Register">;

export function RegisterScreen({}: Props) {
  const setSession = useAuthStore(s => s.setSession);

  const submitControllerRef = useRef<AbortController | undefined>(undefined);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConf, setPasswordConf] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [file, setFile] = useState<UploadFile | undefined>(undefined);

  const [busy, setBusy] = useState(false);

  const displayUri = file ? 
    file.uri : DEFAULT_PROFILE_PICTURE_RESOLVED;

  const validate = (): string | null => {
    if (!username.trim()) return "Username is required";
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    if (password !== passwordConf) return "Passwords don't match";
    if (!firstName.trim()) return "First name is required";
    if (!lastName.trim()) return "Last name is required";
    if (!phone.trim()) return "Phone is required";
    if (!email.trim() || !email.includes("@")) return "Email is not valid";
    return null;
  };

  useEffect(() => {
    return () => {
      submitControllerRef.current?.abort();
    };
  }, []);

  const onPick = async () => {
    const picked = await pickSingleImage();
    if (picked) setFile(picked);
  };

  const onSubmit = async () => {
    const err = validate();
    if (err) return Alert.alert("Error", err);

    submitControllerRef.current?.abort();
    submitControllerRef.current = new AbortController();

    const signal = submitControllerRef.current.signal;

    setBusy(true);

    try {
      const data = {
        username: username.trim(),
        password: password,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        file: file
      } as authApi.RegisterPayload;
      
      const resp = await authApi.register(data, signal);
      await setSession({ token: resp.token, user: resp.user });
    }
    catch (e: any) {
      if (isCanceled(e)) return;
      Alert.alert("Error", getApiErrorMessage(e));
    }
    finally {
      setBusy(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 10 }}>
      <Text style={{ fontSize: 22, fontWeight: "700" }}>Register</Text>

      <View style={{ borderWidth: 1, borderRadius: 12, overflow: "hidden" }}>
        <Image source={{ uri: displayUri }} style={{ width: "100%", height: 220 }} />
        <View style={{ padding: 8, flexDirection: "row", gap: 8 }}>
          <View style={{ flex: 1 }}>
            <Button title="Change" onPress={onPick} />
          </View>
          <View style={{ flex: 1 }}>
            <Button title="Remove" disabled={file === undefined} onPress={() => setFile(undefined)} color="red" />
          </View>
        </View>
      </View>

      <TextInput style={{ borderWidth: 1, padding: 12, borderRadius: 10 }}
        placeholder="Username" value={username} onChangeText={setUsername} autoCapitalize="none" />

      <TextInput style={{ borderWidth: 1, padding: 12, borderRadius: 10 }}
        placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />

      <TextInput style={{ borderWidth: 1, padding: 12, borderRadius: 10 }}
        placeholder="Confirm password" value={passwordConf} onChangeText={setPasswordConf} secureTextEntry />

      <TextInput style={{ borderWidth: 1, padding: 12, borderRadius: 10 }}
        placeholder="First name" value={firstName} onChangeText={setFirstName} />

      <TextInput style={{ borderWidth: 1, padding: 12, borderRadius: 10 }}
        placeholder="Last name" value={lastName} onChangeText={setLastName} />

      <TextInput style={{ borderWidth: 1, padding: 12, borderRadius: 10 }}
        placeholder="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />

      <TextInput style={{ borderWidth: 1, padding: 12, borderRadius: 10 }}
        placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />

      <TouchableOpacity disabled={busy} onPress={onSubmit}
        style={{ padding: 14, borderRadius: 12, borderWidth: 1, opacity: busy ? 0.6 : 1 }}>
        <Text style={{ textAlign: "center", fontWeight: "600" }}>
          {busy ? "Creating..." : "Create account"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
