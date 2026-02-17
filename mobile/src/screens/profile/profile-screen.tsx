import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View, Image, ActivityIndicator, StyleSheet, ScrollView } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuthStore } from "../../stores/auth-store";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ProfileStackParamList } from "../../navigation/types";
import { useTranslation } from "react-i18next";
import { profileTexts } from "../../i18n/i18n-builder";
import i18n from "../../i18n";
import { EXPO_API_BASE_URL } from "../../util/config";
import { resolveImageUrl } from "@app/shared";
import { ImagePreview } from "../sheets/image-preview";

const GREEN = "#2E7D32";

type Props = NativeStackScreenProps<ProfileStackParamList, "ProfileHome">;

type MenuItemProps = {
  icon: string;
  label: string;
  right?: React.ReactNode;
  onPress: () => void;
};

function MenuItem({ icon, label, right, onPress }: MenuItemProps) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.6}>
      <MaterialCommunityIcons name={icon as any} size={22} color="#555" style={styles.menuIcon} />
      <Text style={styles.menuLabel}>{label}</Text>
      <View style={styles.menuRight}>
        {right ?? <MaterialCommunityIcons name="chevron-right" size={22} color="#999" />}
      </View>
    </TouchableOpacity>
  );
}

export function ProfileScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const prof = profileTexts(t);
  
  const me = useAuthStore(s => s.me);
  const logout = useAuthStore(s => s.logout);
  const [lang, setLang] = useState(i18n.language);

  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    const handleChange = (lng: string) => setLang(lng);
    i18n.on("languageChanged", handleChange);
    return () => i18n.off("languageChanged", handleChange);
  }, []);

  if (!me) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={GREEN} />
      </View>
    );
  }

  const url = resolveImageUrl(EXPO_API_BASE_URL, me.profileImagePath);

  const toggleLanguage = () => {
    const next = lang === "sr" ? "en" : "sr";
    i18n.changeLanguage(next);
  };

  const langLabel = lang === "sr" ? prof.Serbian : prof.English;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.headerRow}>
        {url ? (
          <TouchableOpacity onPress={() => setPreviewOpen(true)} activeOpacity={0.8}>
            <Image source={{ uri: url }} style={styles.avatar} />
          </TouchableOpacity>
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <MaterialCommunityIcons name="account" size={48} color="#fff" />
          </View>
        )}

        <View style={styles.userInfo}>
          <Text style={styles.userName}>{me.firstName} {me.lastName}</Text>
          <Text style={styles.userDetail}>{me.email}</Text>
          <Text style={styles.userDetail}>{me.phone}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.menuList}>
        <MenuItem
          icon="translate"
          label={prof.Language}
          onPress={toggleLanguage}
          right={
            <View style={styles.langToggle}>
              <Text style={styles.langText}>{langLabel}</Text>
              <MaterialCommunityIcons name="chevron-down" size={18} color={GREEN} />
            </View>
          }
        />
        <MenuItem icon="account-edit-outline" label={prof.ChangeProfile} onPress={() => navigation.navigate("EditProfile")} />
        <MenuItem icon="lock-reset" label={prof.ChangePassword} onPress={() => navigation.navigate("ChangePassword")} />
        <MenuItem icon="history" label={prof.RentalHistory} onPress={() => navigation.navigate("RentalHistory")} />
        <MenuItem icon="logout" label={prof.Logout} onPress={logout} />
      </View>

      <ImagePreview
        visible={previewOpen}
        uri={url}
        onClose={() => setPreviewOpen(false)}
      />
    </ScrollView>
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
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    marginBottom: 20,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  avatarPlaceholder: {
    backgroundColor: GREEN,
    alignItems: "center",
    justifyContent: "center",
  },
  userInfo: {
    flex: 1,
    gap: 2,
  },
  userName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  userDetail: {
    fontSize: 14,
    color: "#666",
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginHorizontal: 40,
    marginBottom: 24,
  },
  menuList: {
    gap: 4,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
  },
  menuIcon: {
    width: 32,
  },
  menuLabel: {
    flex: 1,
    fontSize: 15,
    color: "#333",
  },
  menuRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  langToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  langText: {
    fontSize: 14,
    color: GREEN,
    fontWeight: "500",
  },
});
