import React, { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RentalStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<RentalStackParamList, "ReportIssue">;

export function ReportIssueScreen({ route, navigation }: Props) {
  const [desc, setDesc] = useState("");

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: "600" }}>Prijava neispravnosti</Text>
      <Text>bikeId: {route.params.bikeId}</Text>
      {route.params.rentalId ? <Text>rentalId: {route.params.rentalId}</Text> : null}

      <TextInput
        placeholder="Opis problema..."
        value={desc}
        onChangeText={setDesc}
        multiline
        style={{ borderWidth: 1, padding: 10, minHeight: 100 }}
      />

      <Button title="Dodaj fotografiju" onPress={() => {}} />
      <Button title="Pošalji prijavu" onPress={() => navigation.goBack() } />
    </View>
  );
}
