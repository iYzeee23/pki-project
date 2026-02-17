import { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useDraftStore } from "../../stores/draft-store";
import { RentalStackParamList } from "../../navigation/types";
import { useTranslation } from "react-i18next";
import { reportIssueTexts } from "../../i18n/i18n-builder";

const GREEN = "#2E7D32";

type Props = NativeStackScreenProps<RentalStackParamList, "ReportIssue">;

export function ReportIssueScreen({ route, navigation }: Props) {
  const { t } = useTranslation();
  const rep = reportIssueTexts(t);
  
  const { bikeId } = route.params;
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const setDraft = useDraftStore((s) => s.setDraft);

  const canNext = description.trim().length >= 10;

  const onNext = () => {
    if (!canNext) {
      setError(rep.Description);
      return;
    }
    setError("");
    setDraft({ bikeId: bikeId, description: description.trim() });
    navigation.navigate("PhotoUpload", { mode: "Issue" });
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{rep.Title}</Text>

        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder={rep.Description}
          placeholderTextColor="#999"
          multiline
          style={styles.textInput}
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity
          style={[styles.nextButton, !canNext && styles.nextButtonDisabled]}
          onPress={onNext}
          activeOpacity={0.8}
        >
          <Text style={styles.nextButtonText}>
            {rep.Next}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 16,
  },
  textInput: {
    minHeight: 120,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: "#333",
    textAlignVertical: "top",
    marginBottom: 12,
  },
  errorText: {
    color: "#d32f2f",
    fontSize: 14,
    marginBottom: 8,
  },
  nextButton: {
    backgroundColor: GREEN,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 4,
  },
  nextButtonDisabled: {
    opacity: 0.5,
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
});
