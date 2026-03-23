import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, FontSize, Spacing, Radius } from '../../constants';
import { useAuth } from '../../context/AuthContext';

export default function LecturerProfile() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout();
          // Auth guard in _layout.tsx handles redirect to login
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >

        {/* Profile avatar and name */}
        <View style={styles.profileHeader}>

          {/* Avatar circle with first letter */}
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.username?.[0]?.toUpperCase() ?? '?'}
            </Text>
          </View>

          {/* Name and role */}
          <Text style={styles.name}>{user?.username ?? '—'}</Text>
          <Text style={styles.role}>Lecturer</Text>

        </View>

        {/* Profile details card */}
        <View style={styles.card}>

          {/* Email row */}
          <View style={styles.row}>
            <View style={styles.rowIcon}>
              <Ionicons name="mail-outline" size={20} color={Colors.primary} />
            </View>
            <View style={styles.rowInfo}>
              <Text style={styles.rowLabel}>Email</Text>
              <Text style={styles.rowValue}>{user?.email ?? '—'}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Role row */}
          <View style={styles.row}>
            <View style={styles.rowIcon}>
              <Ionicons name="shield-outline" size={20} color={Colors.primary} />
            </View>
            <View style={styles.rowInfo}>
              <Text style={styles.rowLabel}>Role</Text>
              <Text style={styles.rowValue}>Lecturer</Text>
            </View>
          </View>

        </View>

        {/* Actions card */}
        <View style={styles.card}>
          <TouchableOpacity style={styles.row}>
            <View style={styles.rowIcon}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={Colors.primary}
              />
            </View>
            <View style={styles.rowInfo}>
              <Text style={styles.rowLabel}>Change Password</Text>
              <Text style={styles.rowValue}>Update your password</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={Colors.subtext}
            />
          </TouchableOpacity>
        </View>

        {/* Logout button */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color={Colors.error} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.lg,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarText: {
    fontSize: FontSize.xxxl,
    fontWeight: 'bold',
    color: Colors.white,
  },
  name: {
    fontSize: FontSize.xl,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  role: {
    fontSize: FontSize.sm,
    color: Colors.subtext,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: Radius.sm,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  rowInfo: {
    flex: 1,
  },
  rowLabel: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.text,
  },
  rowValue: {
    fontSize: FontSize.sm,
    color: Colors.subtext,
    marginTop: Spacing.xs,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.xs,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    gap: Spacing.sm,
    marginTop: Spacing.sm,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  logoutText: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.error,
  },
});