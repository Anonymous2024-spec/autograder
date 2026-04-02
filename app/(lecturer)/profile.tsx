import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Colors,
  FontSize,
  FontWeight,
  Radius,
  Shadows,
  Spacing,
} from "../../constants";
import { useAuth } from "../../context/AuthContext";

const AVATAR_SIZE = 90;

export default function AdminProfile() {
  const { user, logout, updatePhoto } = useAuth();
  const insets = useSafeAreaInsets();

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => { await logout(); },
      },
    ]);
  };

  const handleChangePhoto = () => {
    Alert.alert("Profile Photo", "Choose an option", [
      { text: "Take Photo", onPress: openCamera },
      { text: "Choose from Gallery", onPress: openGallery },
      {
        text: "Remove Photo",
        style: "destructive",
        onPress: async () => { await updatePhoto(""); },
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const openCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        "Permission Required",
        "Please allow camera access in your phone settings."
      );
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1] as [number, number],
      quality: 0.8,
    });
    if (!result.canceled && result.assets?.[0]?.uri) {
      await updatePhoto(result.assets[0].uri);
    }
  };

  const openGallery = async () => {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        "Permission Required",
        "Please allow gallery access in your phone settings."
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1] as [number, number],
      quality: 0.8,
    });
    if (!result.canceled && result.assets?.[0]?.uri) {
      await updatePhoto(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.root}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: insets.bottom + Spacing.xl },
        ]}
      >

        {/* ── Gradient header ── */}
        <LinearGradient
          colors={["#0D1F6B", "#1A3BAA", Colors.primary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.header, { paddingTop: Spacing.xl }]}
        >
          <View style={styles.shapeLarge} />
          <View style={styles.shapeSmall} />

          {/* ── Tappable avatar ── */}
          <TouchableOpacity
            style={styles.avatarContainer}
            onPress={handleChangePhoto}
            activeOpacity={0.85}
          >
            <View style={styles.avatarGlow}>
              {user?.photo ? (
                <Image
                  source={{ uri: user.photo }}
                  style={styles.avatarImage}
                />
              ) : (
                <View style={styles.avatarFallback}>
                  <Text style={styles.avatarText}>
                    {getInitials(user?.username ?? "AU")}
                  </Text>
                </View>
              )}
            </View>
            {/* Camera badge */}
            <View style={styles.editBadge}>
              <Ionicons name="camera" size={14} color={Colors.white} />
            </View>
          </TouchableOpacity>

          {/* Name */}
          <Text style={styles.profileName}>
            {user?.username ?? "Admin User"}
          </Text>

          {/* Role pill */}
          <View style={styles.rolePill}>
            <Ionicons name="shield-checkmark" size={12} color={Colors.white} />
            <Text style={styles.rolePillText}>
              {user?.role === "admin" ? "Administrator" : "Lecturer"}
            </Text>
          </View>

          {/* Email pill */}
          <View style={styles.emailPill}>
            <Ionicons
              name="mail-outline"
              size={13}
              color="rgba(255,255,255,0.8)"
            />
            <Text style={styles.emailPillText}>{user?.email ?? "—"}</Text>
          </View>

          <Text style={styles.photoHint}>Tap photo to change</Text>
        </LinearGradient>

        {/* ── Stats card ── */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>124</Text>
            <Text style={styles.statLabel}>Students</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>8</Text>
            <Text style={styles.statLabel}>Courses</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Staff</Text>
          </View>
        </View>

        {/* ── Account details ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Details</Text>
          <View style={styles.card}>
            <View style={styles.row}>
              <View style={[styles.rowIcon, { backgroundColor: Colors.primaryLight }]}>
                <Ionicons name="mail-outline" size={18} color={Colors.primary} />
              </View>
              <View style={styles.rowInfo}>
                <Text style={styles.rowLabel}>Email Address</Text>
                <Text style={styles.rowValue}>{user?.email ?? "—"}</Text>
              </View>
            </View>

            <View style={styles.rowDivider} />

            <View style={styles.row}>
              <View style={[styles.rowIcon, { backgroundColor: "#EDE9FE" }]}>
                <Ionicons
                  name="shield-outline"
                  size={18}
                  color={Colors.cardPurple}
                />
              </View>
              <View style={styles.rowInfo}>
                <Text style={styles.rowLabel}>Role</Text>
                <Text style={styles.rowValue}>
                  {user?.role === "admin" ? "Administrator" : "Lecturer"}
                </Text>
              </View>
              <View style={styles.roleBadge}>
                <Text style={styles.roleBadgeText}>
                  {user?.role === "admin" ? "Admin" : "Lecturer"}
                </Text>
              </View>
            </View>

            <View style={styles.rowDivider} />

            <View style={styles.row}>
              <View style={[styles.rowIcon, { backgroundColor: Colors.accentLight }]}>
                <Ionicons
                  name="finger-print-outline"
                  size={18}
                  color={Colors.accent}
                />
              </View>
              <View style={styles.rowInfo}>
                <Text style={styles.rowLabel}>User ID</Text>
                <Text style={styles.rowValue}>#{user?.id ?? "—"}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* ── Settings ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <View style={styles.card}>
            <TouchableOpacity style={styles.row} activeOpacity={0.7}>
              <View style={[styles.rowIcon, { backgroundColor: Colors.warningLight }]}>
                <Ionicons
                  name="lock-closed-outline"
                  size={18}
                  color={Colors.warning}
                />
              </View>
              <View style={styles.rowInfo}>
                <Text style={styles.rowLabel}>Change Password</Text>
                <Text style={styles.rowValue}>Update your login password</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={Colors.subtext} />
            </TouchableOpacity>

            <View style={styles.rowDivider} />

            <TouchableOpacity style={styles.row} activeOpacity={0.7}>
              <View style={[styles.rowIcon, { backgroundColor: Colors.successLight }]}>
                <Ionicons
                  name="notifications-outline"
                  size={18}
                  color={Colors.success}
                />
              </View>
              <View style={styles.rowInfo}>
                <Text style={styles.rowLabel}>Notifications</Text>
                <Text style={styles.rowValue}>Manage alerts and reminders</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={Colors.subtext} />
            </TouchableOpacity>

            <View style={styles.rowDivider} />

            <TouchableOpacity style={styles.row} activeOpacity={0.7}>
              <View style={[styles.rowIcon, { backgroundColor: Colors.primaryLight }]}>
                <Ionicons
                  name="information-circle-outline"
                  size={18}
                  color={Colors.primary}
                />
              </View>
              <View style={styles.rowInfo}>
                <Text style={styles.rowLabel}>About AutoGrader</Text>
                <Text style={styles.rowValue}>Version 1.0.0</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={Colors.subtext} />
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Sign out ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.card}>
            <TouchableOpacity
              style={styles.row}
              activeOpacity={0.7}
              onPress={handleLogout}
            >
              <View style={[styles.rowIcon, { backgroundColor: Colors.errorLight }]}>
                <Ionicons
                  name="log-out-outline"
                  size={18}
                  color={Colors.error}
                />
              </View>
              <View style={styles.rowInfo}>
                <Text style={[styles.rowLabel, { color: Colors.error }]}>
                  Sign Out
                </Text>
                <Text style={styles.rowValue}>
                  You will be returned to login
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={Colors.error} />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.footer}>AutoGrader · Gulu University © 2025</Text>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flexGrow: 1,
  },

  // ── Header ──
  header: {
    alignItems: "center",
    paddingBottom: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    overflow: "hidden",
  },
  shapeLarge: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(255,255,255,0.05)",
    top: -60,
    right: -60,
  },
  shapeSmall: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255,255,255,0.05)",
    bottom: -20,
    left: -30,
  },

  // ── Avatar ──
  avatarContainer: {
    marginBottom: Spacing.md,
    position: "relative",
  },
  avatarGlow: {
    width: AVATAR_SIZE + 16,
    height: AVATAR_SIZE + 16,
    borderRadius: (AVATAR_SIZE + 16) / 2,
    backgroundColor: "rgba(255,255,255,0.12)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.white,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  avatarImage: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    borderWidth: 2.5,
    borderColor: "rgba(255,255,255,0.4)",
  },
  avatarFallback: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderWidth: 2.5,
    borderColor: "rgba(255,255,255,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: FontSize.xxxl,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  },
  editBadge: {
    position: "absolute",
    bottom: 4,
    right: 4,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    borderWidth: 2,
    borderColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
  },
  profileName: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.white,
    marginBottom: Spacing.sm,
  },
  rolePill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 5,
    gap: 5,
    marginBottom: Spacing.sm,
  },
  rolePillText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.white,
  },
  emailPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 5,
    gap: 5,
    marginBottom: Spacing.sm,
  },
  emailPillText: {
    fontSize: FontSize.sm,
    color: "rgba(255,255,255,0.85)",
  },
  photoHint: {
    fontSize: FontSize.xs,
    color: "rgba(255,255,255,0.45)",
    marginTop: 2,
  },

  // ── Stats card ──
  statsCard: {
    flexDirection: "row",
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    marginHorizontal: Spacing.lg,
    marginTop: -Spacing.lg,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.md,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  statLabel: {
    fontSize: FontSize.xs,
    color: Colors.subtext,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.border,
  },

  // ── Sections ──
  section: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Colors.subtext,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: Spacing.sm,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: "hidden",
    ...Shadows.sm,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    gap: Spacing.md,
  },
  rowDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginLeft: Spacing.md + 42 + Spacing.md,
  },
  rowIcon: {
    width: 42,
    height: 42,
    borderRadius: Radius.md,
    justifyContent: "center",
    alignItems: "center",
  },
  rowInfo: {
    flex: 1,
  },
  rowLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    marginBottom: 2,
  },
  rowValue: {
    fontSize: FontSize.sm,
    color: Colors.subtext,
  },
  roleBadge: {
    backgroundColor: Colors.primaryLight,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
  },
  roleBadgeText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
  },
  footer: {
    fontSize: FontSize.xs,
    color: Colors.placeholder,
    textAlign: "center",
    marginTop: Spacing.xl,
    marginBottom: Spacing.md,
  },
});