import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../navigation/types";
import { useAuthStore } from "../../stores/auth-store";
import { useTranslation } from "react-i18next";
import { loginTexts } from "../../i18n/i18n-builder";
import { getApiErrorMessage } from "../../util/http";
import { isCanceled } from "@app/shared";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const GREEN = "#2E7D32";

type Props = NativeStackScreenProps<AuthStackParamList, "Login">;

export function LoginScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const logg = loginTexts(t);

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
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
      >
        <View style={styles.logoContainer}>
          <MaterialCommunityIcons name="bike" size={64} color={GREEN} />
          <Text style={styles.logoText}>BikeLand</Text>
        </View>

        <Text style={styles.welcomeTitle}>{logg.WelcomeTitle}</Text>
        <Text style={styles.subtitle}>{logg.Subtitle}</Text>

        <View style={styles.form}>
          <TextInput
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            placeholder={logg.UsernamePlaceholder}
            placeholderTextColor="#999"
            style={styles.input}
          />

          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder={logg.PasswordPlaceholder}
            placeholderTextColor="#999"
            style={styles.input}
          />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity style={styles.loginButton} onPress={onLogin} activeOpacity={0.8}>
            <Text style={styles.loginButtonText}>{logg.Login}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.registerContainer}>
          <Text style={styles.noAccText}>{logg.NoAccQuestion}</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={styles.registerLink}>{logg.RegisterHere}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingVertical: 48,
    paddingBottom: 120,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
    gap: 8,
  },
  logoText: {
    fontSize: 48,
    fontWeight: "700",
    color: GREEN,
  },
  welcomeTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1a1a1a",
    textAlign: "center",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: "#888",
    textAlign: "center",
    marginBottom: 36,
  },
  form: {
    gap: 16,
    marginBottom: 40,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: "#333",
    backgroundColor: "#fff",
  },
  errorText: {
    color: "#d32f2f",
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: GREEN,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 4,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
  registerContainer: {
    alignItems: "center",
    gap: 4,
  },
  noAccText: {
    fontSize: 14,
    color: "#888",
  },
  registerLink: {
    fontSize: 14,
    fontWeight: "600",
    color: GREEN,
    textDecorationLine: "underline",
  },
});
