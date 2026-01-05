import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import MapView from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";

export const API_BASE_URL = "http://192.168.0.16:3000";

/*
export default function App() {
  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
*/

export default function App() {
  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 44.8176,
          longitude: 20.4633,
          latitudeDelta: 0.06,
          longitudeDelta: 0.06,
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
});
