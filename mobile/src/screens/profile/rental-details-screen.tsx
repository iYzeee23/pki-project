import React from "react";
import { View, Text } from "react-native";

export function RentalDetailsScreen({ route }: any) {
  const { rentalId } = route.params;

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text>Detalji iznajmljivanja (placeholder)</Text>
      <Text>rentalId: {rentalId}</Text>
    </View>
  );
}
