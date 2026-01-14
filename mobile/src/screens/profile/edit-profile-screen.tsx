import React, { useEffect, useMemo, useRef, useState } from "react";
import { Alert, Button, Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ProfileStackParamList } from "../../navigation/types";
import { useAuthStore } from "../../stores/auth-store";
import { getApiErrorMessage, isCanceled } from "../../util/api-error";
import { pickSingleImage, UploadFile } from "../../util/image-picker";
import * as profileApi from "../../services/profile-api";
import { DEFAULT_PROFILE_PICTURE_RESOLVED, resolveImageUrl } from "../../util/config";

type Props = NativeStackScreenProps<ProfileStackParamList, "EditProfile">;

export function EditProfileScreen({ navigation }: Props) {
  const me = useAuthStore(s => s.me);
  const setMe = useAuthStore(s => s.setMe);

  if (!me) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Missing user</Text>
      </View>
    );
  }

  const saveControllerRef = useRef<AbortController | undefined>(undefined);

  const [username, setUsername] = useState(me.username);
  const [firstName, setFirstName] = useState(me.firstName);
  const [lastName, setLastName] = useState(me.lastName);
  const [phone, setPhone] = useState(me.phone);
  const [email, setEmail] = useState(me.email);
  const [file, setFile] = useState<UploadFile | undefined | null>(undefined);

  const [busy, setBusy] = useState(false);

  const serverUri = resolveImageUrl(me.profileImagePath);
  const displayUri = file ? 
    file.uri : file === null ?
    DEFAULT_PROFILE_PICTURE_RESOLVED : serverUri;

  useEffect(() => {
    return () => {
      saveControllerRef.current?.abort();
    };
  }, []);

  const validate = (): string | null => {
    if (!username.trim()) return "Username is required";
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

  const onSave = async () => {
    const err = validate();
    if (err) return Alert.alert("Error", err);

    saveControllerRef.current?.abort();
    saveControllerRef.current = new AbortController();

    const signal = saveControllerRef.current.signal;

    setBusy(true);

    try {
      const data = {
        username: username.trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        file: file
      } as profileApi.UpdateMePayload;

      const resp = await profileApi.updateMe(data, signal);
      setMe(resp);

      Alert.alert(
        "Success",
        "Profile updated",
        [ 
          { text: "OK", onPress: () => navigation.goBack() } 
        ]
      );
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
    <View style={{ padding: 16, gap: 10 }}>
      <Text style={{ fontSize: 22, fontWeight: "700" }}>Edit profile</Text>

      <View style={{ borderWidth: 1, borderRadius: 12, overflow: "hidden" }}>
        <Image source={{ uri: displayUri }} style={{ width: "100%", height: 220 }} />
        <View style={{ padding: 8, flexDirection: "row", gap: 8 }}>
          <View style={{ flex: 1 }}>
            <Button title="Change" onPress={onPick} />
          </View>
          <View style={{ flex: 1 }}>
            <Button title="Remove" disabled={file === null} onPress={() => setFile(null)} color="red" />
          </View>
        </View>
      </View>

      <TextInput style={{ borderWidth: 1, padding: 12, borderRadius: 10 }}
        placeholder="Username" value={username} onChangeText={setUsername} autoCapitalize="none" />

      <TextInput style={{ borderWidth: 1, padding: 12, borderRadius: 10 }}
        placeholder="First name" value={firstName} onChangeText={setFirstName} />

      <TextInput style={{ borderWidth: 1, padding: 12, borderRadius: 10 }}
        placeholder="Last name" value={lastName} onChangeText={setLastName} />

      <TextInput style={{ borderWidth: 1, padding: 12, borderRadius: 10 }}
        placeholder="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />

      <TextInput style={{ borderWidth: 1, padding: 12, borderRadius: 10 }}
        placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />

      <TouchableOpacity disabled={busy} onPress={onSave}
        style={{ padding: 14, borderRadius: 12, borderWidth: 1, opacity: busy ? 0.6 : 1 }}>
        <Text style={{ textAlign: "center", fontWeight: "600" }}>
          {busy ? "Saving..." : "Save"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
