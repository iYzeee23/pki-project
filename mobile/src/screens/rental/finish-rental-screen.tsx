import React, { useState } from "react";
import { Button, Text, TextInput, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RentalStackParamList } from "../../navigation/types";
import { useDraftStore } from "../../stores/draft-store";
import { useTranslation } from "react-i18next";
import { finishRentalTexts } from "../../util/i18n-builder";

type Props = NativeStackScreenProps<RentalStackParamList, "FinishRental">;

export function FinishRentalScreen({ route, navigation }: Props) {
    const { t } = useTranslation();
    const fin = finishRentalTexts(t);
    
    const { bikeId } = route.params;

    const [description, setDescription] = useState("");
    const setDraft = useDraftStore((s) => s.setDraft);

    const canNext = description.trim().length >= 10;

    const onNext = () => {
        setDraft({ bikeId: bikeId, description: description.trim() });
        navigation.navigate("PhotoUpload", { mode: "Rental" });
    };

    return (
        <View style={{ padding: 16, gap: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: "600" }}>{fin.Title}</Text>

            <TextInput value={description} onChangeText={setDescription} placeholder={fin.PlaceholderBike}
                multiline style={{ minHeight: 120, borderWidth: 1, borderRadius: 10, padding: 12, }}/>

            <Button title={fin.Next} onPress={onNext} disabled={!canNext} />
        </View>
    );
}
