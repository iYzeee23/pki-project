import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View, Image, ActivityIndicator } from "react-native";
import { useAuthStore } from "../../stores/auth-store";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ProfileStackParamList } from "../../navigation/types";
import { useTranslation } from "react-i18next";
import { profileTexts } from "../../util/i18n-builder";
import i18n from "../../i18n";
import { EXPO_API_BASE_URL } from "../../util/config";
import { resolveImageUrl } from "@app/shared";
import { ImagePreview } from "../sheets/image-preview";

type Props = NativeStackScreenProps<ProfileStackParamList, "ProfileHome">;

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
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const url = resolveImageUrl(EXPO_API_BASE_URL, me.profileImagePath);

  return (
    <View style={{ padding: 16, gap: 12 }}>
    <View style={{ flexDirection: "row", gap: 12, marginBottom: 16 }}>
      <TouchableOpacity onPress={() => i18n.changeLanguage("en")}
        style={{ padding: 8, borderRadius: 8, borderWidth: 1 }}>
        <Text style={{ textAlign: "center" }}>{prof.English}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => i18n.changeLanguage("sr")}
        style={{ padding: 8, borderRadius: 8, borderWidth: 1 }}>
        <Text style={{ textAlign: "center" }}>{prof.Serbian}</Text>
      </TouchableOpacity>
    </View>

      <Text style={{ fontSize: 22, fontWeight: "700" }}>{prof.Title}</Text>

      <View style={{ borderWidth: 1, borderRadius: 12, padding: 12 }}>
        <View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
          {url ? (
            <TouchableOpacity onPress={() => setPreviewOpen(true)} activeOpacity={0.8}>
              <Image source={{ uri: url }} style={{ width: 96, height: 96, borderRadius: 48 }} />
            </TouchableOpacity>
          ) : null}

          <View style={{ gap: 6, flex: 1 }}>
            <Text>
              <Text style={{ fontWeight: "700" }}>{prof.Username}:</Text> {me.username}
            </Text>
            <Text>
              <Text style={{ fontWeight: "700" }}>{prof.Name}:</Text> {me.firstName} {me.lastName}
            </Text>
            <Text>
              <Text style={{ fontWeight: "700" }}>{prof.Email}:</Text> {me.email}
            </Text>
            <Text>
              <Text style={{ fontWeight: "700" }}>{prof.Phone}:</Text> {me.phone}
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity onPress={() => navigation.navigate("EditProfile")}
        style={{ padding: 14, borderRadius: 12, borderWidth: 1 }}>
        <Text style={{ textAlign: "center", fontWeight: "600" }}>{prof.ChangeProfile}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("ChangePassword")}
        style={{ padding: 14, borderRadius: 12, borderWidth: 1 }}>
        <Text style={{ textAlign: "center", fontWeight: "600" }}>{prof.ChangePassword}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("RentalHistory")}
        style={{ padding: 14, borderRadius: 12, borderWidth: 1 }}>
        <Text style={{ textAlign: "center", fontWeight: "600" }}>{prof.RentalHistory}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={logout}
        style={{ padding: 14, borderRadius: 12, borderWidth: 1 }}>
        <Text style={{ textAlign: "center", fontWeight: "600" }}>{prof.Logout}</Text>
      </TouchableOpacity>

      <ImagePreview
        visible={previewOpen}
        uri={url}
        onClose={() => setPreviewOpen(false)}
      />
    </View>
  );
}
