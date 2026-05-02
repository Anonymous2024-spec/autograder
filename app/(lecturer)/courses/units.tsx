import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
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
} from "../../../constants";
import { useAuth } from "../../../context/AuthContext";
import { lecturerAPI } from "../../../services/api";

const UNIT_COLORS = [Colors.cardBlue, Colors.cardTeal, Colors.cardGreen, Colors.cardPurple];

export default function CourseUnitsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { token } = useAuth();
  const { courseId, courseName, courseCode } = useLocalSearchParams();

  const [units, setUnits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!token || !courseId) return;
    lecturerAPI.getCourse(Number(courseId), token)
      .then((course) => setUnits(Array.isArray(course.units) ? course.units : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token, courseId]);

  const filtered = units.filter(
    (u) =>
      u.title.toLowerCase().includes(search.toLowerCase()),
  );

  const handleViewQuestions = (unit: any) => {
    router.push({
      pathname: "/(lecturer)/questions",
      params: { unitId: unit.id, unitName: unit.title, unitCode: courseCode },
    });
  };

  const handleUploadGuide = (unit: any) => {
    router.push({
      pathname: "/(lecturer)/courses/units/upload-guide",
      params: { unitId: unit.id, unitName: unit.title },
    });
  };

  const handleOptions = (unit: any) => {
    Alert.alert(unit.title, "What would you like to do?", [
      {
        text: "View Questions",
        onPress: () => handleViewQuestions(unit),
      },
      {
        text: "Upload Marking Guide",
        onPress: () => handleUploadGuide(unit),
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  return (
    <View style={styles.root}>
      {/* ── Header ── */}
      <LinearGradient
        colors={["#1A3BAA", "#1A56DB", "#0EA5E9"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + Spacing.md }]}
      >
        <View style={styles.headerShapeL} />
        <View style={styles.headerShapeS} />

        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={20} color={Colors.white} />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Course Units</Text>
            <Text style={styles.headerSub} numberOfLines={1}>
              {courseName}
            </Text>
          </View>
        </View>

        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color={Colors.subtext} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search unit name..."
            placeholderTextColor={Colors.placeholder}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Ionicons
                name="close-circle"
                size={18}
                color={Colors.placeholder}
              />
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>

      <View style={styles.resultsRow}>
        <Text style={styles.resultsText}>
          Showing <Text style={styles.resultsCount}>{filtered.length}</Text>{" "}
          {filtered.length === 1 ? "unit" : "units"}
        </Text>
      </View>

      {/* ── List ── */}
      {loading ? (
        <ActivityIndicator color={Colors.primary} style={{ marginTop: Spacing.xl }} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View
                style={[
                  styles.emptyIconBox,
                  { backgroundColor: Colors.primaryLight },
                ]}
              >
                <Ionicons
                  name="layers-outline"
                  size={40}
                  color={Colors.primary}
                />
              </View>
              <Text style={styles.emptyTitle}>No Units Found</Text>
              <Text style={styles.emptyText}>
                {search ? "Try a different search" : "No course units available"}
              </Text>
            </View>
          }
          renderItem={({ item, index }) => {
            const color = UNIT_COLORS[index % UNIT_COLORS.length];
            return (
              <TouchableOpacity
                style={styles.card}
                onPress={() => handleViewQuestions(item)}
                activeOpacity={0.85}
              >
                {/* Color bar on left */}
                <View style={[styles.colorBar, { backgroundColor: color }]} />

                {/* Icon */}
                <View
                  style={[styles.cardIcon, { backgroundColor: color + "18" }]}
                >
                  <Ionicons name="layers" size={22} color={color} />
                </View>

                {/* Info */}
                <View style={styles.cardInfo}>
                  <Text style={styles.cardName} numberOfLines={2}>
                    {item.title}
                  </Text>
                  <View style={styles.cardBottom}>
                    <View
                      style={[
                        styles.codeBadge,
                        { backgroundColor: color + "18" },
                      ]}
                    >
                      <Text style={[styles.codeBadgeText, { color }]}>
                        {courseCode}
                      </Text>
                    </View>
                    <View style={styles.questionCount}>
                      <Ionicons
                        name="reorder-three-outline"
                        size={12}
                        color={Colors.subtext}
                      />
                      <Text style={styles.questionCountText}>
                        Unit {item.order}
                      </Text>
                    </View>
                    {item.marking_guide_path && (
                      <View style={styles.guideBadge}>
                        <Ionicons
                          name="document-text"
                          size={10}
                          color={Colors.success}
                        />
                        <Text style={styles.guideBadgeText}>Guide</Text>
                      </View>
                    )}
                  </View>
                </View>

                {/* Menu */}
                <TouchableOpacity
                  style={styles.menuBtn}
                  onPress={() => handleOptions(item)}
                >
                  <Ionicons
                    name="ellipsis-vertical"
                    size={18}
                    color={Colors.subtext}
                  />
                </TouchableOpacity>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
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
    marginBottom: Spacing.md,
  },
  headerText: { flex: 1 },
  headerTitle: {
    fontSize: FontSize.xxl,
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
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    gap: Spacing.sm,
    ...Shadows.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: FontSize.sm,
    color: Colors.text,
    paddingVertical: 0,
  },
  resultsRow: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  resultsText: { fontSize: FontSize.sm, color: Colors.subtext },
  resultsCount: { fontWeight: FontWeight.bold, color: Colors.primary },
  list: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl * 2,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: "hidden",
    gap: Spacing.md,
    paddingRight: Spacing.md,
    paddingVertical: Spacing.md,
    ...Shadows.sm,
  },
  colorBar: {
    width: 5,
    height: "100%",
    borderRadius: 0,
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    justifyContent: "center",
    alignItems: "center",
  },
  cardInfo: { flex: 1 },
  cardName: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    marginBottom: Spacing.xs,
    lineHeight: 20,
  },
  cardBottom: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  codeBadge: {
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  codeBadgeText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
  },
  questionCount: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  questionCountText: {
    fontSize: FontSize.xs,
    color: Colors.subtext,
  },
  guideBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    backgroundColor: Colors.successLight,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.xs,
    paddingVertical: 1,
  },
  guideBadgeText: {
    fontSize: FontSize.xs - 1,
    fontWeight: FontWeight.bold,
    color: Colors.success,
  },
  menuBtn: { padding: Spacing.xs },
  emptyContainer: {
    alignItems: "center",
    paddingTop: Spacing.xl * 2,
  },
  emptyIconBox: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  emptyTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  emptyText: {
    fontSize: FontSize.sm,
    color: Colors.subtext,
    textAlign: "center",
  },
});
