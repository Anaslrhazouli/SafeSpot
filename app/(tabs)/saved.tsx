import React, { useMemo, useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  RefreshControl,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useSpotsList, useSpotThumbnails } from "@/hooks/useSpots";
import { useLocation } from "@/hooks/useLocation";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingState } from "@/components/ui/LoadingState";
import { Chip } from "@/components/ui/Chip";
import { CATEGORY_ICONS, CATEGORY_COLORS } from "@/constants/spots";
import { calculateDistance } from "@/services/locationService";
import { formatDistance } from "@/utils/formatting";
import { colors, spacing, typography, radius } from "@/theme/tokens";
import type { Spot } from "@/types/spot";

export default function SavedScreen() {
  const router = useRouter();
  const { data: spots, isLoading, refetch } = useSpotsList() as {
    data: Spot[] | undefined;
    isLoading: boolean;
    refetch: () => void;
  };
  const { latitude, longitude } = useLocation();
  const [filter, setFilter] = useState<"all" | "favorites" | "safe">("all");

  const savedSpots = useMemo(() => {
    const all = spots ?? [];
    switch (filter) {
      case "favorites":
        return all.filter((s) => s.is_favorite);
      case "safe":
        return all.filter((s) => s.is_safe_at_night);
      default:
        return all;
    }
  }, [spots, filter]);

  const spotIds = useMemo(() => savedSpots.map((s) => s.id), [savedSpots]);
  const { data: thumbnails } = useSpotThumbnails(spotIds);

  const getDistance = useCallback(
    (spot: Spot): number | null => {
      if (!latitude || !longitude || !spot.latitude || !spot.longitude) return null;
      return calculateDistance(latitude, longitude, spot.latitude, spot.longitude);
    },
    [latitude, longitude]
  );

  if (isLoading && !spots?.length) {
    return <LoadingState message="Loading your collection..." />;
  }

  const stats = {
    total: spots?.length ?? 0,
    favorites: spots?.filter((s) => s.is_favorite).length ?? 0,
    safe: spots?.filter((s) => s.is_safe_at_night).length ?? 0,
  };

  const listHeader = (
    <>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.heading}>My Collection</Text>
        <Text style={styles.headerSub}>
          {stats.total} place{stats.total !== 1 ? "s" : ""} saved
        </Text>
      </View>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <TouchableOpacity
          style={[styles.statCard, filter === "all" && styles.statCardActive]}
          onPress={() => setFilter("all")}
          activeOpacity={0.7}
        >
          <View style={[styles.statIcon, { backgroundColor: colors.primary + "12" }]}>
            <Ionicons name="location-outline" size={16} color={colors.primary} />
          </View>
          <Text style={styles.statNumber}>{stats.total}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.statCard, filter === "favorites" && styles.statCardActive]}
          onPress={() => setFilter("favorites")}
          activeOpacity={0.7}
        >
          <View style={[styles.statIcon, { backgroundColor: colors.accent + "15" }]}>
            <Ionicons name="heart-outline" size={16} color={colors.accent} />
          </View>
          <Text style={styles.statNumber}>{stats.favorites}</Text>
          <Text style={styles.statLabel}>Favorites</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.statCard, filter === "safe" && styles.statCardActive]}
          onPress={() => setFilter("safe")}
          activeOpacity={0.7}
        >
          <View style={[styles.statIcon, { backgroundColor: colors.success + "15" }]}>
            <Ionicons name="shield-checkmark-outline" size={16} color={colors.success} />
          </View>
          <Text style={styles.statNumber}>{stats.safe}</Text>
          <Text style={styles.statLabel}>Safe</Text>
        </TouchableOpacity>
      </View>

      {/* Active Filter Label */}
      <View style={styles.filterHeader}>
        <Text style={styles.filterTitle}>
          {filter === "all" ? "All Spots" : filter === "favorites" ? "Favorites" : "Safe at Night"}
        </Text>
        <Text style={styles.filterCount}>{savedSpots.length}</Text>
      </View>
    </>
  );

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <FlatList
        data={savedSpots}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={
          <EmptyState
            title={filter === "all" ? "No spots yet" : `No ${filter} spots`}
            message={filter === "all" ? "Tap + to save your first spot." : "Try a different filter."}
          />
        }
        renderItem={({ item }) => {
          const catIcon = CATEGORY_ICONS[item.category] ?? "location";
          const catColor = CATEGORY_COLORS[item.category] ?? colors.primary;
          const dist = getDistance(item);
          const thumb = thumbnails?.[item.id];
          return (
            <TouchableOpacity
              style={styles.listItem}
              onPress={() => router.push(`/(tabs)/spot/${item.id}`)}
              activeOpacity={0.7}
            >
              {thumb ? (
                <Image source={{ uri: thumb }} style={styles.listThumb} />
              ) : (
                <View style={[styles.listThumb, styles.listThumbPlaceholder, { backgroundColor: catColor + "12" }]}>
                  <Ionicons name={catIcon as any} size={20} color={catColor} />
                </View>
              )}
              <View style={styles.listInfo}>
                <Text style={styles.listTitle} numberOfLines={1}>{item.title}</Text>
                <View style={styles.listMeta}>
                  <View style={[styles.categoryDot, { backgroundColor: catColor }]} />
                  <Text style={styles.listCategory}>{item.category}</Text>
                  {dist != null && (
                    <>
                      <Text style={styles.listSep}>·</Text>
                      <Text style={styles.listDist}>{formatDistance(dist)}</Text>
                    </>
                  )}
                </View>
              </View>
              <View style={styles.listRight}>
                {item.is_favorite && (
                  <Ionicons name="heart-outline" size={14} color={colors.accent} />
                )}
                {item.rating > 0 && (
                  <View style={styles.listRating}>
                    <Ionicons name="star-outline" size={11} color={colors.warning} />
                    <Text style={styles.listRatingText}>{item.rating}</Text>
                  </View>
                )}
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.border} />
            </TouchableOpacity>
          );
        }}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor={colors.primary} />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
  },
  heading: {
    ...typography.h1,
    color: colors.textPrimary,
  },
  headerSub: {
    ...typography.small,
    color: colors.textTertiary,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: "row",
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: "center",
    gap: 6,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  statCardActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + "06",
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  statNumber: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  statLabel: {
    ...typography.small,
    color: colors.textTertiary,
  },
  filterHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  filterTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  filterCount: {
    ...typography.small,
    color: colors.textTertiary,
    backgroundColor: colors.surfaceAlt,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.pill,
    overflow: "hidden",
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    marginHorizontal: spacing.lg,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  listThumb: {
    width: 46,
    height: 46,
    borderRadius: 12,
  },
  listThumbPlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  listInfo: {
    flex: 1,
    gap: 3,
  },
  listTitle: {
    ...typography.body,
    fontWeight: "600",
    color: colors.textPrimary,
    fontSize: 15,
  },
  listMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  categoryDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  listCategory: {
    ...typography.small,
    color: colors.textTertiary,
  },
  listSep: {
    color: colors.textTertiary,
    fontSize: 10,
  },
  listDist: {
    ...typography.small,
    color: colors.primary,
    fontWeight: "600",
  },
  listRight: {
    alignItems: "flex-end",
    gap: 4,
  },
  listRating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  listRatingText: {
    ...typography.small,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  list: {
    paddingBottom: spacing["3xl"],
  },
});
