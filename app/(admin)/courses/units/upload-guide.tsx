import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors, FontSize, FontWeight, Radius, Shadows, Spacing } from "../../../../constants";
import { useAuth } from "../../../../context/AuthContext";
import { adminAPI } from "../../../../services/api";

export default function AdminUploadMarkingGuideScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { token } = useAuth();
  const { unitId, unitName } = useLocalSearchParams();

  const [selectedFile, setSelectedFile] = useState<{ uri: string; name: string; size?: number } | null>(null);
  const [uploading, setUploading] = useState(false);

  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/pdf",
      copyToCacheDirectory: true,
    });

    if (result.canceled) return;

    const file = result.assets[0];
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      Alert.alert("Invalid File", "Please select a PDF file only.");
      return;
    }

    setSelectedFile({ uri: file.uri, name: file.name, size: file.size });
  };

  const handleUpload = async () => {
    if (!selectedFile || !token || !unitId) return;

    setUploading(true);
    try {
      await adminAPI.uploadUnitMarkingGuide(
        Number(unitId),
        selectedFile.uri,
        selectedFile.name,
        token
      );
      Alert.alert("Success", "Marking guide uploaded successfully.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error: any) {
      Alert.alert("Upload Failed", error.message || "Could not upload marking guide.");
    } finally {
      setUploading(false);
    }
  };

  const formatSize = (bytes?: number) => {
    if (!bytes) return "Unknown size";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={["#064E3B", "#059669", Colors.cardGreen]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + Spacing.md }]}
      >
        <View style={styles.headerShapeL} />
        <View style={styles.headerShapeS} />

        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={20} color={Colors.white} />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Upload Marking Guide</Text>
            <Text style={styles.headerSub} numberOfLines={1}>
              {unitName}
            </Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.body}>
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={24} color={Colors.cardGreen} />
          <Text style={styles.infoText}>
            Upload a single PDF containing the marking guide for all questions in this unit.
          </Text>
        </View>

        <TouchableOpacity style={styles.pickArea} onPress={pickDocument} activeOpacity={0.7}>
          {selectedFile ? (
            <>
              <View style={styles.fileIcon}>
                <Ionicons name="document" size={40} color={Colors.cardGreen} />
              </View>
              <Text style={styles.fileName} numberOfLines={2}>{selectedFile.name}</Text>
              <Text style={styles.fileSize}>{formatSize(selectedFile.size)}</Text>
              <TouchableOpacity style={styles.changeBtn} onPress={pickDocument}>
                <Ionicons name="swap-horizontal" size={16} color={Colors.cardGreen} />
                <Text style={styles.changeText}>Change file</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View style={styles.pickIcon}>
                <Ionicons name="cloud-upload-outline" size={48} color={Colors.subtext} />
              </View>
              <Text style={styles.pickTitle}>Tap to select PDF</Text>
              <Text style={styles.pickSub}>Only PDF files are accepted</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.uploadBtn, (!selectedFile || uploading) && styles.uploadBtnDisabled]}
          onPress={handleUpload}
          disabled={!selectedFile || uploading}
          activeOpacity={0.8}
        >
          {uploading ? (
            <>
              <ActivityIndicator color={Colors.white} />
              <Text style={styles.uploadBtnText}>Uploading...</Text>
            </>
          ) : (
            <>
              <Ionicons name="cloud-upload" size={20} color={Colors.white} />
              <Text style={styles.uploadBtnText}>Upload Marking Guide</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
    overflow: "hidden",
  },
  headerShapeL: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(255,255,255,0.05)",
    top: -60,
    right: -40,
  },
  headerShapeS: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.05)",
    bottom: 10,
    left: -20,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  headerText: { flex: 1 },
  headerTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  },
  headerSub: {
    fontSize: FontSize.sm,
    color: "rgba(255,255,255,0.7)",
    marginTop: 2,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  body: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.sm,
    backgroundColor: Colors.successLight,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  infoText: {
    flex: 1,
    fontSize: FontSize.sm,
    color: Colors.cardGreen,
    lineHeight: 20,
  },
  pickArea: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: "dashed",
    padding: Spacing.xl * 2,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.lg,
    ...Shadows.sm,
  },
  pickIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  pickTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    marginBottom: 4,
  },
  pickSub: {
    fontSize: FontSize.sm,
    color: Colors.subtext,
  },
  fileIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.successLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  fileName: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    textAlign: "center",
    marginBottom: 4,
    maxWidth: "80%",
  },
  fileSize: {
    fontSize: FontSize.sm,
    color: Colors.subtext,
    marginBottom: Spacing.md,
  },
  changeBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.full,
    backgroundColor: Colors.successLight,
  },
  changeText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.cardGreen,
  },
  uploadBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    backgroundColor: Colors.cardGreen,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.md + 2,
    ...Shadows.sm,
  },
  uploadBtnDisabled: {
    backgroundColor: Colors.subtext,
    opacity: 0.5,
  },
  uploadBtnText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  },
});
