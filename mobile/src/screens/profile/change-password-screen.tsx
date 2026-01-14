import React, { useEffect, useRef, useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import * as profileApi from "../../services/profile-api";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ProfileStackParamList } from "../../navigation/types";
import { getApiErrorMessage, isCanceled } from "../../util/api-error";

type Props = NativeStackScreenProps<ProfileStackParamList, "ChangePassword">;

export function ChangePasswordScreen({ navigation }: Props) {
  const submitControllerRef = useRef<AbortController | undefined>(undefined);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConf, setNewPasswordConf] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    return () => {
      submitControllerRef.current?.abort();
    };
  }, []);  

  const validate = () => {
    if (!oldPassword) return "Input the current password";
    if (!newPassword || newPassword.length < 6) return "New password needs to have at least 6 characters";
    if (newPassword !== newPasswordConf) return "Passwords don't match";
    return null;
  };

  const onSubmit = async () => {
    const err = validate();
    if (err) return Alert.alert("Error", err);

    submitControllerRef.current?.abort();
    submitControllerRef.current = new AbortController();

    const signal = submitControllerRef.current.signal;

    setBusy(true);

    try {
      await profileApi.changePassword({ 
        oldPassword: oldPassword, 
        newPassword: newPassword
      }, signal);

      Alert.alert(
        "Success",
        "Password has been changed",
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
      <Text style={{ fontSize: 22, fontWeight: "700" }}>Promena lozinke</Text>

      <TextInput placeholder="Current password" value={oldPassword} onChangeText={setOldPassword}
        secureTextEntry style={{ borderWidth: 1, padding: 12, borderRadius: 10 }} />

      <TextInput placeholder="New password" value={newPassword} onChangeText={setNewPassword}
        secureTextEntry style={{ borderWidth: 1, padding: 12, borderRadius: 10 }} />

      <TextInput placeholder="Confirm new password" value={newPasswordConf} onChangeText={setNewPasswordConf}
        secureTextEntry style={{ borderWidth: 1, padding: 12, borderRadius: 10 }} />

      <TouchableOpacity disabled={busy} onPress={onSubmit}
        style={{ padding: 14, borderRadius: 12, borderWidth: 1, opacity: busy ? 0.6 : 1 }}>
        <Text style={{ textAlign: "center", fontWeight: "600" }}>
          {busy ? "Changing..." : "Change passoword"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
