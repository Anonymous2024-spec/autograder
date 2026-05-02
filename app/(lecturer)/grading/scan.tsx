import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, FontSize, Radius, Spacing } from "../../../constants";
import { useAuth } from "../../../context/AuthContext";
import { gradingAPI } from "../../../services/api";

export default function ScanScreen() {
  const router = useRouter();
  const { unitId, unitName, studentId, studentName } = useLocalSearchParams();
  const { token } = useAuth();

  const [permission, requestPermission] = useCameraPermissions();

  const cameraRef = useRef<CameraView>(null);

  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleCapture = async () => {
    if (!cameraRef.current) return;

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
      });

      if (photo?.uri) {
        setCapturedImage(photo.uri);
      }
    } catch (err) {
      console.error("Failed to capture image:", err);
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
  };

  const handleGrade = async () => {
    if (!capturedImage || !token || !unitId || !studentId) {
      Alert.alert("Error", "Missing required information");
      return;
    }

    setProcessing(true);

    try {
      const filename = capturedImage.split("/").pop() || "answer.jpg";
      const match = /\.(\w+)$/.exec(filename);
      const type = match && match[1].toLowerCase() === "jpg" ? "image/jpeg" : match ? `image/${match[1]}` : "image/jpeg";

      const result = await gradingAPI.gradeUnit(
        Number(unitId),
        Number(studentId),
        { uri: capturedImage, name: filename, type } as any,
        token
      );

      setProcessing(false);

      router.push({
        pathname: "/(lecturer)/grading/result",
        params: {
          gradeId: result.grade.id,
          unitName,
          studentName,
        },
      });
    } catch (err: any) {
      console.error("Grading error:", err);
      setProcessing(false);
      Alert.alert("Error", err.message || "Failed to grade. Please try again.");
    }
  };

  if (!permission) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.centeredContainer}>
        <View style={styles.permissionCard}>
          <Ionicons name="camera-outline" size={56} color={Colors.primary} />
          <Text style={styles.permissionTitle}>Camera Access Needed</Text>
          <Text style={styles.permissionText}>
            The camera is required to scan the student&apos;s answer sheet.
          </Text>
          <TouchableOpacity
            style={styles.permissionBtn}
            onPress={requestPermission}
          >
            <Text style={styles.permissionBtnText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (capturedImage) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.previewHeader}>
          <Text style={styles.previewTitle}>Answer Sheet Preview</Text>
          <Text style={styles.previewSubtitle}>
            {studentName} — {unitName}
          </Text>
        </View>

        <Image
          source={{ uri: capturedImage }}
          style={styles.previewImage}
          resizeMode="contain"
        />

        <View style={styles.previewActions}>
          <TouchableOpacity
            style={styles.retakeBtn}
            onPress={handleRetake}
            disabled={processing}
          >
            <Ionicons name="refresh-outline" size={20} color={Colors.primary} />
            <Text style={styles.retakeBtnText}>Retake</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.proceedBtn, processing && styles.proceedBtnDisabled]}
            onPress={handleGrade}
            disabled={processing}
          >
            {processing ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <>
                <Ionicons name="sparkles-outline" size={20} color={Colors.white} />
                <Text style={styles.proceedBtnText}>Send to AI</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing="back">
        <SafeAreaView style={styles.cameraOverlay}>
          <View style={styles.instructionBar}>
            <Ionicons
              name="information-circle-outline"
              size={18}
              color={Colors.white}
            />
            <Text style={styles.instructionText}>
              Align the answer sheet within the frame
            </Text>
          </View>

          <View style={styles.frameContainer}>
            <View style={styles.scanFrame}>
              <View style={[styles.corner, styles.cornerTL]} />
              <View style={[styles.corner, styles.cornerTR]} />
              <View style={[styles.corner, styles.cornerBL]} />
              <View style={[styles.corner, styles.cornerBR]} />
            </View>
          </View>

          <View style={styles.controls}>
            <TouchableOpacity style={styles.captureBtn} onPress={handleCapture}>
              <View style={styles.captureBtnInner} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },

  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
    padding: Spacing.lg,
  },

  permissionCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.xl,
    alignItems: "center",
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  permissionTitle: {
    fontSize: FontSize.xl,
    fontWeight: "bold",
    color: Colors.text,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  permissionText: {
    fontSize: FontSize.sm,
    color: Colors.subtext,
    textAlign: "center",
    marginBottom: Spacing.lg,
    lineHeight: 20,
  },
  permissionBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
  },
  permissionBtnText: {
    fontSize: FontSize.md,
    fontWeight: "600",
    color: Colors.white,
  },

  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    justifyContent: "space-between",
  },

  instructionBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.55)",
    margin: Spacing.lg,
    padding: Spacing.md,
    borderRadius: Radius.md,
    gap: Spacing.sm,
  },
  instructionText: {
    fontSize: FontSize.sm,
    color: Colors.white,
    flex: 1,
  },

  frameContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scanFrame: {
    width: 300,
    height: 400,
    position: "relative",
  },

  corner: {
    position: "absolute",
    width: 24,
    height: 24,
    borderColor: Colors.white,
  },
  cornerTL: {
    top: 0,
    left: 0,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderTopLeftRadius: Radius.sm,
  },
  cornerTR: {
    top: 0,
    right: 0,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderTopRightRadius: Radius.sm,
  },
  cornerBL: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderBottomLeftRadius: Radius.sm,
  },
  cornerBR: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomRightRadius: Radius.sm,
  },

  controls: {
    alignItems: "center",
    paddingBottom: Spacing.xl * 1.5,
  },

  captureBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
  },

  captureBtnInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.white,
  },

  previewHeader: {
    padding: Spacing.lg,
    backgroundColor: Colors.white,
  },
  previewTitle: {
    fontSize: FontSize.xl,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  previewSubtitle: {
    fontSize: FontSize.sm,
    color: Colors.subtext,
  },
  previewImage: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  previewActions: {
    flexDirection: "row",
    padding: Spacing.lg,
    gap: Spacing.md,
    backgroundColor: Colors.white,
  },

  retakeBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  retakeBtnText: {
    fontSize: FontSize.md,
    fontWeight: "600",
    color: Colors.primary,
  },

  proceedBtn: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  proceedBtnDisabled: {
    opacity: 0.7,
  },
  proceedBtnText: {
    fontSize: FontSize.md,
    fontWeight: "600",
    color: Colors.white,
  },
});
