import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { pickSingleImage, UploadFile } from "../../util/image-picker";
import { useAuthStore } from "../../stores/auth-store";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../navigation/types";
import { DEFAULT_PROFILE_PICTURE_RESOLVED } from "../../util/config";
import { useTranslation } from "react-i18next";
import { commonTexts, registerTexts } from "../../i18n/i18n-builder";
import { authApi } from "../../util/services";
import { getApiErrorMessage } from "../../util/http";
import { isCanceled } from "@app/shared";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const GREEN = "#2E7D32";

type Props = NativeStackScreenProps<AuthStackParamList, "Register">;

export function RegisterScreen({}: Props) {
  const { t } = useTranslation();
  const reg = registerTexts(t);
  const com = commonTexts();

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
  const [error, setError] = useState("");

  const [busy, setBusy] = useState(false);

  const displayUri = file ? 
    file.uri : DEFAULT_PROFILE_PICTURE_RESOLVED;

  const validate = (): string | null => {
    if (!username.trim()) return reg.ErrUsername;
    if (!password) return reg.ErrPassword;
    if (password.length < 6) return reg.ErrLength;
    if (password !== passwordConf) return reg.ErrMissmatch;
    if (!firstName.trim()) return reg.ErrFirstName;
    if (!lastName.trim()) return reg.ErrLastName;
    if (!phone.trim()) return reg.ErrPhone;
    if (!email.trim() || !email.includes("@")) return reg.ErrMail;
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
      const form = new FormData();
      form.append("username", username.trim());
      form.append("password", password);
      form.append("firstName", firstName.trim());
      form.append("lastName", lastName.trim());
      form.append("phone", phone.trim());
      form.append("email", email.trim());

      if (file) {
        form.append("file", {
          uri: file.uri,
          name: file.name,
          type: file.type,
        } as any);
      }
      
      const resp = await authApi.register(form, signal);
      await setSession({ token: resp.token, user: resp.user });
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
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
      {/* Logo */}
      <View style={styles.logoContainer}>
        <MaterialCommunityIcons name="bike" size={64} color={GREEN} />
        <Text style={styles.logoText}>BikeLand</Text>
      </View>

      {/* Profile picture */}
      <View style={styles.avatarSection}>
        <View style={styles.imageWrapper}>
          <Image source={{ uri: displayUri }} style={styles.image} />
        </View>
        <View style={styles.avatarActions}>
          <TouchableOpacity onPress={onPick}>
            <Text style={styles.changeText}>{reg.Change}</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity disabled={file === undefined} onPress={() => setFile(undefined)}>
            <Text style={[styles.removeText, file === undefined && styles.disabledText]}>
              {reg.Remove}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Form fields */}
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder={reg.Username}
          placeholderTextColor="#999"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder={reg.Password}
          placeholderTextColor="#999"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TextInput
          style={styles.input}
          placeholder={reg.ConfPassword}
          placeholderTextColor="#999"
          value={passwordConf}
          onChangeText={setPasswordConf}
          secureTextEntry
        />

        <TextInput
          style={styles.input}
          placeholder={reg.FirstName}
          placeholderTextColor="#999"
          value={firstName}
          onChangeText={setFirstName}
        />

        <TextInput
          style={styles.input}
          placeholder={reg.LastName}
          placeholderTextColor="#999"
          value={lastName}
          onChangeText={setLastName}
        />

        <TextInput
          style={styles.input}
          placeholder={reg.Phone}
          placeholderTextColor="#999"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />

        <TextInput
          style={styles.input}
          placeholder={reg.Email}
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      {/* Error */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {/* Submit button */}
      <TouchableOpacity
        disabled={busy}
        onPress={onSubmit}
        style={[styles.submitButton, busy && styles.submitButtonDisabled]}
        activeOpacity={0.8}
      >
        <Text style={styles.submitButtonText}>
          {busy ? reg.Creating : reg.CreateAcc}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    paddingHorizontal: 32,
    paddingTop: 24,
    paddingBottom: 40,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    gap: 8,
  },
  logoText: {
    fontSize: 48,
    fontWeight: "700",
    color: GREEN,
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: 28,
  },
  imageWrapper: {
    width: "100%",
    height: 220,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 10,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  avatarActions: {
    alignItems: "center",
    gap: 4,
  },
  changeText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  divider: {
    width: 24,
    height: 2,
    backgroundColor: "#333",
    marginVertical: 2,
  },
  removeText: {
    fontSize: 14,
    color: "#333",
  },
  disabledText: {
    color: "#bbb",
  },
  form: {
    gap: 14,
    marginBottom: 16,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingHorizontal: 4,
    paddingVertical: 12,
    fontSize: 15,
    color: "#333",
  },
  errorText: {
    color: "#d32f2f",
    fontSize: 14,
    marginBottom: 12,
  },
  submitButton: {
    backgroundColor: GREEN,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 4,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
});
