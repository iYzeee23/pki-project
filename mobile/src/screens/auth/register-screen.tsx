import React, { useState } from "react";
import { Alert, Image, ScrollView, Text, TextInput, TouchableOpacity } from "react-native";
import { getApiErrorMessage } from "../../util/api-error";
import { pickSingleImage, UploadFile } from "../../util/image-picker";
import * as authApi from "../../services/auth-api";
import { useAuthStore } from "../../stores/auth-store";

export function RegisterScreen() {
  const setSession = useAuthStore(s => s.setSession);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConf, setPasswordConf] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [file, setFile] = useState<UploadFile | undefined>(undefined);

  const [busy, setBusy] = useState(false);

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

  const onPick = async () => {
    const picked = await pickSingleImage();
    if (picked) setFile(picked);
  };

  const onSubmit = async () => {
    const err = validate();
    if (err) return Alert.alert("Error", err);

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
      
      const resp = await authApi.register(data);
      await setSession({ token: resp.token, user: resp.user });
    }
    catch (e) {
      Alert.alert("Error", getApiErrorMessage(e));
    }
    finally {
      setBusy(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 10 }}>
      <Text style={{ fontSize: 22, fontWeight: "700" }}>Register</Text>

      <TouchableOpacity onPress={onPick}
        style={{ padding: 14, borderRadius: 12, borderWidth: 1 }}>
        <Text style={{ textAlign: "center", fontWeight: "600" }}>
          {file ? "Change profile image" : "Pick profile image (optional)"}
        </Text>
      </TouchableOpacity>

      { file?.uri && <Image source={{ uri: file.uri }} style={{ width: 96, height: 96, borderRadius: 48 }} /> }

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
