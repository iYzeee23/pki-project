import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useDraftStore } from "../../stores/draft-store";
import { useRentalStore } from "../../stores/rental-store";
import { RentalStackParamList } from "../../navigation/types";
import { pickMultipleImages, UploadFile } from "../../util/image-picker";
import { useMapStore } from "../../stores/map-store";
import { useTranslation } from "react-i18next";
import { commonTexts, photoUploadTexts } from "../../i18n/i18n-builder";
import { CommonActions } from "@react-navigation/native";
import { imageApi, issueApi, rentalApi } from "../../util/services";
import { getApiErrorMessage } from "../../util/http";
import { isCanceled } from "@app/shared";

const GREEN = "#2E7D32";

type Props = NativeStackScreenProps<RentalStackParamList, "PhotoUpload">;

export function PhotoUploadScreen({ route, navigation }: Props) {
  const { t } = useTranslation();
  const pht = photoUploadTexts(t);
  const com = commonTexts();
  
  const { mode } = route.params;

  const submitControllerRef = useRef<AbortController | undefined>(undefined);

  const draft = useDraftStore((s) => s.draft);
  const clearDraft = useDraftStore((s) => s.clearDraft);

  const markDirty = useMapStore((s) => s.markDirty);
  const setActiveRental = useRentalStore((s) => s.setActiveRental);

  const [files, setFiles] = useState<UploadFile[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    return () => {
      submitControllerRef.current?.abort();
    };
  }, []);

  const onPickImages = async () => {
    try {
      const picked = await pickMultipleImages();
      if (picked.length) setFiles(picked);
    } 
    catch (e: any) {
      if (isCanceled(e)) return;
      Alert.alert(com.Error, getApiErrorMessage(e));
    }
  };

  const remove = (uri: string) => {
    setFiles(files => files.filter(x => x.uri !== uri));
  };

  const validateDraft = () => {
    if (!draft) return false;
    
    return !!draft.bikeId && draft.description.trim().length > 0;
  };

  const onSubmit = async () => {
    if (!validateDraft()) {
      Alert.alert(com.Error, pht.MissingInformation);
      return;
    }

    if (files.length === 0) {
      Alert.alert(com.Error, pht.AddImage);
      return;
    }

    submitControllerRef.current?.abort();
    submitControllerRef.current = new AbortController();

    const signal = submitControllerRef.current.signal;

    setSubmitting(true);

    try {
      let ownerId: string;
      let message: string;

      if (mode === "Issue") {
        const issue = await issueApi.create({
          bikeId: draft!.bikeId,
          description: draft!.description
        }, signal);

        ownerId = issue.id;
        message = pht.MsgSuccessfulIssue;
      } else {
        const rental = await rentalApi.finish({
          description: draft!.description,
        }, signal);

        ownerId = rental.id;
        message = pht.MsgSuccessfulRental;

        markDirty();
        setActiveRental(undefined);
      }

      const form = new FormData();

      form.append("ownerId", ownerId);
      form.append("ownerModel", mode);

      for (const file of files) {
          form.append("files", {
              uri: file.uri,
              name: file.name,
              type: file.type,
          } as any);
      }

      await imageApi.upload(form, signal);

      Alert.alert(com.Success, message);

      clearDraft();
      
      navigation.getParent()?.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "MapTab", params: { screen: "MapScreen" } }],
        })
      );
    } 
    catch (e: any) {
      if (isCanceled(e)) return;
      Alert.alert(com.Error, getApiErrorMessage(e));
    } 
    finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.outerContainer}>
      <View style={styles.card}>
        <Text style={styles.title}>{pht.Title}</Text>

        {files.length === 0 ? (
          <TouchableOpacity style={styles.addArea} onPress={onPickImages} disabled={submitting}>
            <Text style={styles.addAreaText}>{pht.AddPhotos}</Text>
          </TouchableOpacity>
        ) : (
          <FlatList
            data={files}
            keyExtractor={(f) => f.uri}
            contentContainerStyle={styles.imageList}
            renderItem={({ item }) => (
              <View style={styles.imageWrapper}>
                <Image source={{ uri: item.uri }} style={styles.image} />
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => remove(item.uri)}
                  disabled={submitting}
                >
                  <Text style={styles.removeText}>{pht.Remove}</Text>
                </TouchableOpacity>
              </View>
            )}
            ListFooterComponent={
              <TouchableOpacity onPress={onPickImages} disabled={submitting} style={styles.addMoreArea}>
                <Text style={styles.addAreaText}>{pht.AddPhotos}</Text>
              </TouchableOpacity>
            }
          />
        )}

        {submitting && <ActivityIndicator size="large" color={GREEN} style={styles.spinner} />}

        <TouchableOpacity
          style={[styles.submitButton, (submitting || files.length === 0) && styles.submitButtonDisabled]}
          onPress={onSubmit}
          disabled={submitting || files.length === 0}
          activeOpacity={0.8}
        >
          <Text style={styles.submitButtonText}>
            {pht.Submit}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 16,
  },
  addArea: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    borderStyle: "dashed",
    paddingVertical: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  addMoreArea: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    borderStyle: "dashed",
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  addAreaText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  imageList: {
    gap: 12,
    paddingBottom: 8,
  },
  imageWrapper: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 200,
  },
  removeButton: {
    padding: 10,
    alignItems: "center",
  },
  removeText: {
    fontSize: 14,
    color: "#d32f2f",
    fontWeight: "600",
  },
  spinner: {
    marginVertical: 12,
  },
  submitButton: {
    backgroundColor: GREEN,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 12,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
});
