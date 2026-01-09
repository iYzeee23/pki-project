import React from "react";
import { View, Text, Button } from "react-native";

export function RentalHistoryScreen({ navigation }: any) {
  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text>Istorija iznajmljivanja (placeholder)</Text>
      <Button title="Detalji" onPress={() => navigation.navigate("RentalDetails", { rentalId: "rental-123" })} />
    </View>
  );
}
