import React, { useEffect, useState, useMemo } from "react";
import { View, Text, ScrollView, Alert, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "@/hooks/useLocation";
import { useSpotsList } from "@/hooks/useSpots";
import { CATEGORY_COLORS, CATEGORY_ICONS } from "@/constants/spots";
import { colors, spacing, typography, radius } from "@/theme/tokens";
import type { Spot } from "@/types/spot";

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const { permissionStatus, checkPermission } = useLocation();
  const { data: spots } = useSpotsList() as { data: Spot[] | undefined };
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  const handleLogout = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          setLoggingOut(true);
          try {
            await signOut();
          } catch (err: any) {
            Alert.alert("Error", err.message ?? "Failed to sign out");
          } finally {
            setLoggingOut(false);
          }
        },
      },
    ]);
  };

  const locationGranted = permissionStatus === "granted";
  const userName = user?.email?.split("@")[0] ?? "User";
  const userInitial = userName.charAt(0).toUpperCase();

  const stats = useMemo(() => {
    const all = spots ?? [];
    return {
      total: all.length,
      favorites: all.filter((s) => s.is_favorite).length,
      categories: new Set(all.map((s) => s.category)).size,
    };
  }, [spots]);

  const topCategories = useMemo(() => {
    const all = spots ?? [];
    const counts: Record<string, number> = {};
    all.forEach((s) => { counts[s.category] = (counts[s.category] ?? 0) + 1; });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4);
  }, [spots]);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Hero Header */}
        <View style={styles.hero}>
          <View style={styles.heroAvatar}>
            <Text style={styles.heroAvatarText}>{userInitial}</Text>
          </View>
          <Text style={styles.heroName}>{userName}</Text>
          <Text style={styles.heroEmail}>{user?.email ?? "---"}</Text>
          <View style={styles.memberBadge}>
            <Ionicons name="checkmark-circle-outline" size={12} color={colors.secondary} />
            <Text style={styles.memberText}>SafeSpot Student</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: colors.primary + "12" }]}>
              <Ionicons name="location-outline" size={18} color={colors.primary} />
            </View>
            <Text style={styles.statNum}>{stats.total}</Text>
            <Text style={styles.statLabel}>Spots</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: colors.accent + "15" }]}>
              <Ionicons name="heart-outline" size={18} color={colors.accent} />
            </View>
            <Text style={styles.statNum}>{stats.favorites}</Text>
            <Text style={styles.statLabel}>Favorites</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: colors.success + "15" }]}>
              <Ionicons name="shield-checkmark-outline" size={18} color={colors.success} />
            </View>
            <Text style={styles.statNum}>{stats.categories}</Text>
            <Text style={styles.statLabel}>Categories</Text>
          </View>
        </View>

        {/* Top Categories */}
        {topCategories.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Top Categories</Text>
            <View style={styles.card}>
              {topCategories.map(([cat, count], i) => {
                const catColor = CATEGORY_COLORS[cat] ?? colors.primary;
                const catIcon = CATEGORY_ICONS[cat] ?? "location-outline";
                return (
                  <View
                    key={cat}
                    style={[styles.categoryRow, i < topCategories.length - 1 && styles.rowBorder]}
                  >
                    <View style={[styles.categoryIcon, { backgroundColor: catColor + "15" }]}>
                      <Ionicons name={catIcon as any} size={16} color={catColor} />
                    </View>
                    <Text style={styles.categoryName}>{cat}</Text>
                    <View style={styles.countBadge}>
                      <Text style={styles.countText}>{count} spot{count !== 1 ? "s" : ""}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </>
        )}

        {/* App */}
        <Text style={styles.sectionTitle}>App</Text>
        <View style={styles.card}>
          <View style={[styles.prefRow, styles.rowBorder]}>
            <View style={styles.prefLeft}>
              <View style={[styles.prefIcon, { backgroundColor: colors.primary + "10" }]}>
                <Ionicons name="location-outline" size={16} color={colors.primary} />
              </View>
              <Text style={styles.prefLabel}>Location</Text>
            </View>
            <View style={[styles.statusPill, {
              backgroundColor: locationGranted ? colors.success + "12" : colors.error + "12",
            }]}>
              <View style={[styles.statusDot, {
                backgroundColor: locationGranted ? colors.success : colors.error,
              }]} />
              <Text style={[styles.statusLabel, {
                color: locationGranted ? colors.success : colors.error,
              }]}>
                {locationGranted ? "Enabled" : "Disabled"}
              </Text>
            </View>
          </View>
          <View style={styles.prefRow}>
            <View style={styles.prefLeft}>
              <View style={[styles.prefIcon, { backgroundColor: colors.info + "10" }]}>
                <Ionicons name="information-circle-outline" size={16} color={colors.info} />
              </View>
              <Text style={styles.prefLabel}>Version</Text>
            </View>
            <Text style={styles.prefValue}>1.0.0</Text>
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          disabled={loggingOut}
          activeOpacity={0.7}
        >
          <Ionicons name="log-out-outline" size={18} color={colors.error} />
          <Text style={styles.logoutText}>
            {loggingOut ? "Signing out..." : "Sign Out"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    paddingBottom: 120,
  },
  // Hero
  hero: {
    backgroundColor: colors.primary,
    alignItems: "center",
    paddingTop: spacing.xl,
    paddingBottom: spacing["2xl"],
    paddingHorizontal: spacing.lg,
  },
  heroAvatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: "rgba(255,255,255,0.18)",
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.35)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  heroAvatarText: {
    fontSize: 34,
    fontWeight: "700",
    color: colors.white,
  },
  heroName: {
    ...typography.h2,
    color: colors.white,
    letterSpacing: 0.3,
  },
  heroEmail: {
    ...typography.small,
    color: "rgba(255,255,255,0.6)",
    marginTop: 3,
  },
  memberBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: spacing.sm,
    backgroundColor: "rgba(255,255,255,0.12)",
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    borderRadius: radius.pill,
  },
  memberText: {
    ...typography.small,
    color: "rgba(255,255,255,0.8)",
  },
  // Stats
  statsRow: {
    flexDirection: "row",
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    alignItems: "center",
    gap: spacing.xs,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 2,
  },
  statNum: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  statLabel: {
    ...typography.small,
    color: colors.textTertiary,
  },
  sectionTitle: {
    ...typography.small,
    fontWeight: "600",
    color: colors.textTertiary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
    marginHorizontal: spacing.lg,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: spacing.base,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border + "60",
  },
  categoryIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryName: {
    ...typography.body,
    fontSize: 15,
    fontWeight: "500",
    color: colors.textPrimary,
    flex: 1,
  },
  countBadge: {
    backgroundColor: colors.surfaceAlt,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  countText: {
    ...typography.small,
    color: colors.textTertiary,
    fontWeight: "600",
  },
  prefRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.md,
  },
  prefLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  prefIcon: {
    width: 32,
    height: 32,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
  },
  prefLabel: {
    ...typography.body,
    fontSize: 15,
    color: colors.textPrimary,
  },
  prefValue: {
    ...typography.small,
    color: colors.textTertiary,
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusLabel: {
    ...typography.small,
    fontWeight: "600",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    paddingVertical: spacing.base,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.error + "30",
    backgroundColor: colors.surface,
    marginHorizontal: spacing.lg,
  },
  logoutText: {
    ...typography.body,
    fontSize: 15,
    fontWeight: "600",
    color: colors.error,
  },
});
