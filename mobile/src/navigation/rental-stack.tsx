import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RentalStackParamList } from "./types";
import { ActiveRentalScreen } from "../screens/rental/active-rental-screen";
import { QrScannerScreen } from "../screens/rental/qr-scanner-screen";
import { PhotoUploadScreen } from "../screens/rental/photo-upload-screen";
import { ReportIssueScreen } from "../screens/rental/report-issue-screen";

const Stack = createNativeStackNavigator<RentalStackParamList>();

export function RentalStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ActiveRental" component={ActiveRentalScreen} options={{ title: "Iznajmljivanje" }} />
      <Stack.Screen name="QrScanner" component={QrScannerScreen} options={{ title: "Skeniraj QR" }} />
      <Stack.Screen name="PhotoUpload" component={PhotoUploadScreen} options={{ title: "Upload fotografije" }} />
      <Stack.Screen name="ReportIssue" component={ReportIssueScreen} options={{ title: "Prijava neispravnosti" }} />
    </Stack.Navigator>
  );
}
