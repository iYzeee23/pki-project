import { useEffect, useRef, useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ProfileStackParamList } from "../../navigation/types";
import { useTranslation } from "react-i18next";
import { changePasswordTexts, commonTexts } from "../../i18n/i18n-builder";
import { profileApi } from "../../util/services";
import { getApiErrorMessage } from "../../util/http";
import { isCanceled } from "@app/shared";

const GREEN = "#2E7D32";

type Props = NativeStackScreenProps<ProfileStackParamList, "ChangePassword">;

export function ChangePasswordScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const chp = changePasswordTexts(t);
  const com = commonTexts();

  const submitControllerRef = useRef<AbortController | undefined>(undefined);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConf, setNewPasswordConf] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    return () => {
      submitControllerRef.current?.abort();
    };
  }, []);  

  const validate = () => {
    if (!oldPassword) return chp.ErrOldMissing;
    if (!newPassword || newPassword.length < 6) return chp.ErrNewMin;
    if (newPassword !== newPasswordConf) return chp.ErrMismatch;
    return null;
  };

  const onSubmit = async () => {
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setError("");

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
        com.Success,
        chp.SuccessMsg,
        [
          { text: com.Ok, onPress: () => navigation.goBack() }
        ]
      );
    }
    catch (e: any) {
      if (isCanceled(e)) return;
      setError(getApiErrorMessage(e));
    }
    finally {
      setBusy(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled" keyboardDismissMode="interactive">
      {/* Password fields */}
      <Text style={styles.label}>{chp.OldPlaceholder}</Text>
      <TextInput style={styles.input} placeholder={chp.OldPlaceholder} value={oldPassword}
        onChangeText={setOldPassword} secureTextEntry editable={!busy} />

      <Text style={styles.label}>{chp.NewPlaceholder}</Text>
      <TextInput style={styles.input} placeholder={chp.NewPlaceholder} value={newPassword}
        onChangeText={setNewPassword} secureTextEntry editable={!busy} />

      <Text style={styles.label}>{chp.ConfPlaceholder}</Text>
      <TextInput style={styles.input} placeholder={chp.ConfPlaceholder} value={newPasswordConf}
        onChangeText={setNewPasswordConf} secureTextEntry editable={!busy} />

      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : null}

      <TouchableOpacity
        style={[styles.saveButton, busy && styles.saveButtonDisabled]}
        onPress={onSubmit}
        disabled={busy}
        activeOpacity={0.8}
      >
        <Text style={styles.saveButtonText}>
          {busy ? chp.Changing : chp.Save}
        </Text>
      </TouchableOpacity>
    </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
    paddingBottom: 120,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: GREEN,
    marginTop: 10,
    marginBottom: 2,
    paddingHorizontal: 8,
  },
  separator: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 16,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    paddingVertical: 14,
    paddingHorizontal: 8,
    fontSize: 15,
    color: "#333",
    marginBottom: 4,
  },
  errorText: {
    fontSize: 13,
    color: "#d32f2f",
    marginTop: 12,
  },
  errorPlaceholder: {
    fontSize: 13,
    color: "#d32f2f",
    marginTop: 12,
    opacity: 0.7,
  },
  saveButton: {
    backgroundColor: GREEN,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
});
