import React from "react";
import { View, Text, Button } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RentalStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<RentalStackParamList, "PhotoUpload">;

export function PhotoUploadScreen({ route, navigation }: Props) {
  const { purpose, rentalId, bikeId } = route.params;

  const title = purpose === "RETURN" ? 
    "Fotografija vracanja bicikla" : 
    "Fotografija kvara";

  const onDone = () => {
    if (purpose === "RETURN") navigation.popToTop();
    else navigation.goBack();
  };

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: "600" }}>{title}</Text>

      {rentalId ? <Text>rentalId: {rentalId}</Text> : null}
      {bikeId ? <Text>bikeId: {bikeId}</Text> : null}

      <Button title="Usnimi/izaberi fotografiju" onPress={() => {}} />
      <Button title="Posalji" onPress={onDone} />
    </View>
  );
}
