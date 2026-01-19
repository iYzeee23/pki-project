import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RentalStackParamList } from "./types";
import { ActiveRentalScreen } from "../screens/rental/active-rental-screen";
import { QrScannerScreen } from "../screens/rental/qr-scanner-screen";
import { PhotoUploadScreen } from "../screens/rental/photo-upload-screen";
import { ReportIssueScreen } from "../screens/rental/report-issue-screen";
import { FinishRentalScreen } from "../screens/rental/finish-rental-screen";
import { commonTexts } from "../i18n/i18n-builder";

const Stack = createNativeStackNavigator<RentalStackParamList>();

export function RentalStack() {
  const com = commonTexts();
    
  return (
    <Stack.Navigator>
      <Stack.Screen name="ActiveRental" component={ActiveRentalScreen} options={{ title: com.ActiveRental }} />
      <Stack.Screen name="QrScanner" component={QrScannerScreen} options={{ title: com.QrScanner }} />
      <Stack.Screen name="FinishRental" component={FinishRentalScreen} options={{ title: com.FinishRental }} />
      <Stack.Screen name="PhotoUpload" component={PhotoUploadScreen} options={{ title: com.PhotoUpload }} />
      <Stack.Screen name="ReportIssue" component={ReportIssueScreen} options={{ title: com.ReportIssue }} />
    </Stack.Navigator>
  );
}
