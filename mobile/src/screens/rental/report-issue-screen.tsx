import React, { useState } from "react";
import { Button, TextInput, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useDraftStore } from "../../stores/draft-store";
import { RentalStackParamList } from "../../navigation/types";
import { useTranslation } from "react-i18next";
import { reportIssueTexts } from "../../util/i18n-builder";

type Props = NativeStackScreenProps<RentalStackParamList, "ReportIssue">;

export function ReportIssueScreen({ route, navigation }: Props) {
  const { t } = useTranslation();
  const rep = reportIssueTexts(t);
  
  const { bikeId } = route.params;
  const [description, setDescription] = useState("");

  const setDraft = useDraftStore((s) => s.setDraft);

  const canNext = description.trim().length >= 10;

  const onNext = () => {
    setDraft({ bikeId: bikeId, description: description.trim() });
    navigation.navigate("PhotoUpload", { mode: "Issue" });
  };

  return (
    <View style={{ padding: 16, gap: 12 }}>
      <TextInput value={description} onChangeText={setDescription} placeholder={rep.Description}
        multiline style={{ minHeight: 120, borderWidth: 1, borderRadius: 10, padding: 12 }} />

      <Button title={rep.Next} onPress={onNext} disabled={!canNext} />
    </View>
  );
}
