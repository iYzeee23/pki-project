import { useEffect, useRef, useState } from "react";
import { Alert, Button, Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ProfileStackParamList } from "../../navigation/types";
import { useAuthStore } from "../../stores/auth-store";
import { getApiErrorMessage, isCanceled } from "../../util/api-error";
import { pickSingleImage, UploadFile } from "../../util/image-picker";
import * as profileApi from "../../services/profile-api";
import { DEFAULT_PROFILE_PICTURE_RESOLVED, resolveImageUrl } from "../../util/config";
import { useTranslation } from "react-i18next";
import { commonTexts, editProfileTexts } from "../../util/i18n-builder";

type Props = NativeStackScreenProps<ProfileStackParamList, "EditProfile">;

export function EditProfileScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const edit = editProfileTexts(t);
  const com = commonTexts();

  const me = useAuthStore(s => s.me);
  const setMe = useAuthStore(s => s.setMe);

  if (!me) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>{edit.MissingUser}</Text>
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
    if (!username.trim()) return edit.ErrUsername;
    if (!firstName.trim()) return edit.ErrFirstName;
    if (!lastName.trim()) return edit.ErrLastName;
    if (!phone.trim()) return edit.ErrPhone;
    if (!email.trim() || !email.includes("@")) return edit.ErrMail;
    return null;
  };

  const onPick = async () => {
    const picked = await pickSingleImage();
    if (picked) setFile(picked);
  };

  const onSave = async () => {
    const err = validate();
    if (err) return Alert.alert(com.Error, err);

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
        com.Success,
        edit.ProfileUpdated,
        [ 
          { text: com.Ok, onPress: () => navigation.goBack() } 
        ]
      );
    }
    catch (e: any) {
      if (isCanceled(e)) return;
      Alert.alert(com.Error, getApiErrorMessage(e));
    }
    finally {
      setBusy(false);
    }
  };

  return (
    <View style={{ padding: 16, gap: 10 }}>
      <Text style={{ fontSize: 22, fontWeight: "700" }}>{edit.Title}</Text>

      <View style={{ borderWidth: 1, borderRadius: 12, overflow: "hidden" }}>
        <Image source={{ uri: displayUri }} style={{ width: "100%", height: 220 }} />
        <View style={{ padding: 8, flexDirection: "row", gap: 8 }}>
          <View style={{ flex: 1 }}>
            <Button title={edit.Change} onPress={onPick} />
          </View>
          <View style={{ flex: 1 }}>
            <Button title={edit.Remove} disabled={file === null} onPress={() => setFile(null)} color="red" />
          </View>
        </View>
      </View>

      <TextInput style={{ borderWidth: 1, padding: 12, borderRadius: 10 }}
        placeholder={edit.Username} value={username} onChangeText={setUsername} autoCapitalize="none" />

      <TextInput style={{ borderWidth: 1, padding: 12, borderRadius: 10 }}
        placeholder={edit.FirstName} value={firstName} onChangeText={setFirstName} />

      <TextInput style={{ borderWidth: 1, padding: 12, borderRadius: 10 }}
        placeholder={edit.LastName} value={lastName} onChangeText={setLastName} />

      <TextInput style={{ borderWidth: 1, padding: 12, borderRadius: 10 }}
        placeholder={edit.Phone} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />

      <TextInput style={{ borderWidth: 1, padding: 12, borderRadius: 10 }}
        placeholder={edit.Email} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />

      <TouchableOpacity disabled={busy} onPress={onSave}
        style={{ padding: 14, borderRadius: 12, borderWidth: 1, opacity: busy ? 0.6 : 1 }}>
        <Text style={{ textAlign: "center", fontWeight: "600" }}>{busy ? edit.Saving : edit.SaveProfile}</Text>
      </TouchableOpacity>
    </View>
  );
}
