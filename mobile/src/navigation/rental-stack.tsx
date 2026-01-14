import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RentalStackParamList } from "./types";
import { ActiveRentalScreen } from "../screens/rental/active-rental-screen";
import { QrScannerScreen } from "../screens/rental/qr-scanner-screen";
import { PhotoUploadScreen } from "../screens/rental/photo-upload-screen";
import { ReportIssueScreen } from "../screens/rental/report-issue-screen";
import { FinishRentalScreen } from "../screens/rental/finish-rental-screen";

const Stack = createNativeStackNavigator<RentalStackParamList>();

export function RentalStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ActiveRental" component={ActiveRentalScreen} options={{ title: "Active rental" }} />
      <Stack.Screen name="QrScanner" component={QrScannerScreen} options={{ title: "QR scanner" }} />
      <Stack.Screen name="FinishRental" component={FinishRentalScreen} options={{ title: "Finish rental" }} />
      <Stack.Screen name="PhotoUpload" component={PhotoUploadScreen} options={{ title: "Photo upload" }} />
      <Stack.Screen name="ReportIssue" component={ReportIssueScreen} options={{ title: "Report issue" }} />
    </Stack.Navigator>
  );
}
