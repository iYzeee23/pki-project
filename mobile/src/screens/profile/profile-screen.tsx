import React, { useEffect } from "react";
import { Text, TouchableOpacity, View, Image, ActivityIndicator } from "react-native";
import { useAuthStore } from "../../stores/auth-store";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ProfileStackParamList } from "../../navigation/types";
import { resolveImageUrl } from "../../util/config";

type Props = NativeStackScreenProps<ProfileStackParamList, "ProfileHome">;

export function ProfileScreen({ navigation }: Props) {
  const me = useAuthStore(s => s.me);
  const logout = useAuthStore(s => s.logout);

  if (!me) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const url = resolveImageUrl(me.profileImagePath);

  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: "700" }}>Profile</Text>

      <View style={{ borderWidth: 1, borderRadius: 12, padding: 12, gap: 10 }}>
        {url && <Image source={{ uri: url }} style={{ width: 96, height: 96, borderRadius: 48 }} />}

        <View style={{ gap: 6 }}>
          <Text>
            <Text style={{ fontWeight: "700" }}>Username:</Text> {me.username}
          </Text>
          <Text>
            <Text style={{ fontWeight: "700" }}>Name:</Text> {me.firstName} {me.lastName}
          </Text>
          <Text>
            <Text style={{ fontWeight: "700" }}>Email:</Text> {me.email}
          </Text>
          <Text>
            <Text style={{ fontWeight: "700" }}>Phone:</Text> {me.phone}
          </Text>
        </View>
      </View>

      <TouchableOpacity onPress={() => navigation.navigate("EditProfile")}
        style={{ padding: 14, borderRadius: 12, borderWidth: 1 }}>
        <Text style={{ textAlign: "center", fontWeight: "600" }}>Change profile settings</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("ChangePassword")}
        style={{ padding: 14, borderRadius: 12, borderWidth: 1 }}>
        <Text style={{ textAlign: "center", fontWeight: "600" }}>Change password</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("RentalHistory")}
        style={{ padding: 14, borderRadius: 12, borderWidth: 1 }}>
        <Text style={{ textAlign: "center", fontWeight: "600" }}>Rental history</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={logout}
        style={{ padding: 14, borderRadius: 12, borderWidth: 1 }}>
        <Text style={{ textAlign: "center", fontWeight: "600" }}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
