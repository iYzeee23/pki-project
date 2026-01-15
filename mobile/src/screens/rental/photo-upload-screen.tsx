import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, Button, FlatList, Image, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useDraftStore } from "../../stores/draft-store";
import { useRentalStore } from "../../stores/rental-store";
import * as rentalApi from "../../services/rental-api";
import * as issueApi from "../../services/issue-api";
import * as imageApi from "../../services/image-api";
import { RentalStackParamList } from "../../navigation/types";
import { getApiErrorMessage, isCanceled } from "../../util/api-error";
import { pickMultipleImages, UploadFile } from "../../util/image-picker";
import { useMapStore } from "../../stores/map-store";
import { useTranslation } from "react-i18next";
import { commonTexts, photoUploadTexts } from "../../util/i18n-builder";
import { CommonActions } from "@react-navigation/native";

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

      await imageApi.upload({
        ownerId: ownerId,
        ownerModel: mode,
        files: files
      }, signal);

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
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Button title={pht.AddPhotos} onPress={onPickImages} disabled={submitting} />

      <FlatList data={files} keyExtractor={(f) => f.uri} contentContainerStyle={{ gap: 12, paddingVertical: 8 }}
        renderItem={({ item }) => (
          <View style={{ borderWidth: 1, borderRadius: 12, overflow: "hidden" }}>
            <Image source={{ uri: item.uri }} style={{ width: "100%", height: 200 }} />
            <View style={{ padding: 8 }}>
              <Button title={pht.Remove} onPress={() => remove(item.uri)} disabled={submitting} />
            </View>
          </View>
        )} />

      {submitting && <ActivityIndicator size="large" />}

      <Button title={pht.Submit} onPress={onSubmit} disabled={submitting} />
    </View>
  );
}
