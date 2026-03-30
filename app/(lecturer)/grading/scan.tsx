import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, FontSize, Radius, Spacing } from "../../../constants";

export default function ScanScreen() {
  const router = useRouter();
  const { courseId, studentId } = useLocalSearchParams();

  // Camera permission hook
  const [permission, requestPermission] = useCameraPermissions();

  // Reference to the camera so we can call takePictureAsync
  const cameraRef = useRef<CameraView>(null);

  // Store the captured image URI
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  // Track processing state after capture
  const [processing, setProcessing] = useState(false);

  // Handle taking a picture
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

  // Discard captured image and retake
  const handleRetake = () => {
    setCapturedImage(null);
  };

  // Proceed to result screen with captured image
  const handleProceed = async () => {
    if (!capturedImage) return;

    setProcessing(true);

    // TODO: Send capturedImage to Gemini API for OCR
    // For now just navigate to result screen with image URI
    setTimeout(() => {
      setProcessing(false);
      router.push({
        pathname: "/grading/result",
        params: {
          courseId,
          studentId,
          imageUri: capturedImage,
        },
      });
    }, 1500);
  };

  // ── Permission not yet determined ──
  if (!permission) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  // ── Permission denied ──
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

  // ── Image captured — show preview ──
  if (capturedImage) {
    return (
      <SafeAreaView style={styles.container}>
        {/* Preview header */}
        <View style={styles.previewHeader}>
          <Text style={styles.previewTitle}>Answer Sheet Preview</Text>
          <Text style={styles.previewSubtitle}>
            Make sure the sheet is clear and fully visible
          </Text>
        </View>

        {/* Captured image preview */}
        <Image
          source={{ uri: capturedImage }}
          style={styles.previewImage}
          resizeMode="contain"
        />

        {/* Action buttons */}
        <View style={styles.previewActions}>
          {/* Retake button */}
          <TouchableOpacity
            style={styles.retakeBtn}
            onPress={handleRetake}
            disabled={processing}
          >
            <Ionicons name="refresh-outline" size={20} color={Colors.primary} />
            <Text style={styles.retakeBtnText}>Retake</Text>
          </TouchableOpacity>

          {/* Proceed button */}
          <TouchableOpacity
            style={styles.proceedBtn}
            onPress={handleProceed}
            disabled={processing}
          >
            {processing ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <>
                <Ionicons
                  name="checkmark-outline"
                  size={20}
                  color={Colors.white}
                />
                <Text style={styles.proceedBtnText}>Use This Scan</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ── Camera view ──
  return (
    <View style={styles.container}>
      {/* Camera fills the screen */}
      <CameraView ref={cameraRef} style={styles.camera} facing="back">
        {/* Overlay UI on top of camera */}
        <SafeAreaView style={styles.cameraOverlay}>
          {/* Top instruction bar */}
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

          {/* Scan frame guide */}
          <View style={styles.frameContainer}>
            <View style={styles.scanFrame}>
              {/* Corner indicators */}
              <View style={[styles.corner, styles.cornerTL]} />
              <View style={[styles.corner, styles.cornerTR]} />
              <View style={[styles.corner, styles.cornerBL]} />
              <View style={[styles.corner, styles.cornerBR]} />
            </View>
          </View>

          {/* Bottom controls */}
          <View style={styles.controls}>
            {/* Capture button */}
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

  // ── Centered states (permission, loading) ──
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
    padding: Spacing.lg,
  },

  // Permission card
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

  // ── Camera view ──
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    justifyContent: "space-between",
  },

  // Top instruction bar
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

  // Scan frame with corner guides
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

  // Corner markers
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

  // Bottom capture controls
  controls: {
    alignItems: "center",
    paddingBottom: Spacing.xl * 1.5,
  },

  // Outer capture button ring
  captureBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
  },

  // Inner filled circle
  captureBtnInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.white,
  },

  // ── Preview screen ──
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

  // Retake button
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

  // Proceed button
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
  proceedBtnText: {
    fontSize: FontSize.md,
    fontWeight: "600",
    color: Colors.white,
  },
});
