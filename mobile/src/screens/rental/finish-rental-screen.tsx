import React, { useState } from "react";
import { Button, Text, TextInput, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RentalStackParamList } from "../../navigation/types";
import { useDraftStore } from "../../stores/draft-store";

type Props = NativeStackScreenProps<RentalStackParamList, "FinishRental">;

export function FinishRentalScreen({ route, navigation }: Props) {
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
            <Text style={{ fontSize: 16, fontWeight: "600" }}>Describe how was the bike ride</Text>

            <TextInput value={description} onChangeText={setDescription} placeholder="Bike ride was fun"
                multiline style={{ minHeight: 120, borderWidth: 1, borderRadius: 10, padding: 12, }}/>

            <Button title="Next" onPress={onNext} disabled={!canNext} />
        </View>
    );
}
