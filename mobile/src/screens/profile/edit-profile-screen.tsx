import { useEffect, useRef, useState } from "react";
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ProfileStackParamList } from "../../navigation/types";
import { useAuthStore } from "../../stores/auth-store";
import { pickSingleImage, UploadFile } from "../../util/image-picker";
import { EXPO_API_BASE_URL, DEFAULT_PROFILE_PICTURE_RESOLVED } from "../../util/config";
import { useTranslation } from "react-i18next";
import { commonTexts, editProfileTexts } from "../../i18n/i18n-builder";
import { profileApi } from "../../util/services";
import { DEFAULT_PROFILE_PICTURE, isCanceled, resolveImageUrl } from "@app/shared";
import { getApiErrorMessage } from "../../util/http";

const GREEN = "#2E7D32";

type Props = NativeStackScreenProps<ProfileStackParamList, "EditProfile">;

export function EditProfileScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const edit = editProfileTexts(t);
  const com = commonTexts();

  const me = useAuthStore(s => s.me);
  const setMe = useAuthStore(s => s.setMe);

  if (!me) {
    return (
      <View style={styles.loadingContainer}>
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
  const [error, setError] = useState("");

  const [busy, setBusy] = useState(false);

  const serverUri = resolveImageUrl(EXPO_API_BASE_URL, me.profileImagePath);
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

  const shouldDisable = () => {
    const userErasedImage = file === null;
    const userDoesntHaveImage = file === undefined && me.profileImagePath === DEFAULT_PROFILE_PICTURE;

    return userErasedImage || userDoesntHaveImage;
  }

  const onPick = async () => {
    const picked = await pickSingleImage();
    if (picked) setFile(picked);
  };

  const onSave = async () => {
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setError("");

    saveControllerRef.current?.abort();
    saveControllerRef.current = new AbortController();

    const signal = saveControllerRef.current.signal;

    setBusy(true);

    try {
      const form = new FormData();

      form.append("username", username.trim());
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

      const resp = await profileApi.updateMe(form, signal);
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
      setError(getApiErrorMessage(e));
    }
    finally {
      setBusy(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>{edit.Title}</Text>

      {/* Image + Change/Remove */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: displayUri }} style={styles.image} />
      </View>
      <View style={styles.photoActions}>
        <TouchableOpacity onPress={onPick} disabled={busy}>
          <Text style={styles.changePhotoText}>{edit.ChangePhoto}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setFile(null)} disabled={busy || shouldDisable()}>
          <Text style={[styles.removeText, (busy || shouldDisable()) && styles.disabledText]}>
            {edit.Remove}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.divider} />

      {/* Input fields */}
      <Text style={styles.label}>{edit.Username}</Text>
      <TextInput style={styles.input} placeholder={edit.Username} value={username}
        onChangeText={setUsername} autoCapitalize="none" editable={!busy} />

      <Text style={styles.label}>{edit.FirstName}</Text>
      <TextInput style={styles.input} placeholder={edit.FirstName} value={firstName}
        onChangeText={setFirstName} editable={!busy} />

      <Text style={styles.label}>{edit.LastName}</Text>
      <TextInput style={styles.input} placeholder={edit.LastName} value={lastName}
        onChangeText={setLastName} editable={!busy} />

      <Text style={styles.label}>{edit.Phone}</Text>
      <TextInput style={styles.input} placeholder={edit.Phone} value={phone}
        onChangeText={setPhone} keyboardType="phone-pad" editable={!busy} />

      <Text style={styles.label}>{edit.Email}</Text>
      <TextInput style={styles.input} placeholder={edit.Email} value={email}
        onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" editable={!busy} />

      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : null}

      <TouchableOpacity
        style={[styles.saveButton, busy && styles.saveButtonDisabled]}
        onPress={onSave}
        disabled={busy}
        activeOpacity={0.8}
      >
        <Text style={styles.saveButtonText}>
          {busy ? edit.Saving : edit.SaveProfile}
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
  contentContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  imageContainer: {
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    marginBottom: 8,
  },
  image: {
    width: "100%",
    height: 220,
  },
  photoActions: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginBottom: 12,
  },
  changePhotoText: {
    fontSize: 15,
    fontWeight: "700",
    color: GREEN,
  },
  removeText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#d32f2f",
  },
  disabledText: {
    opacity: 0.3,
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginHorizontal: 40,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: GREEN,
    marginTop: 10,
    marginBottom: 2,
    paddingHorizontal: 8,
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
