import React, { useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/hooks/useAuth";
import { useSpotsList, useSpotThumbnails } from "@/hooks/useSpots";
import { useLocation } from "@/hooks/useLocation";
import { SpotCard } from "@/components/spots/SpotCard";
import { Chip } from "@/components/ui/Chip";
import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorState } from "@/components/ui/ErrorState";
import { EmptyState } from "@/components/ui/EmptyState";
import { CATEGORIES, CATEGORY_ICONS } from "@/constants/spots";
import { calculateDistance } from "@/services/locationService";
import { colors, spacing, typography, radius } from "@/theme/tokens";
import type { Spot } from "@/types/spot";

export default function SpotListScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { data: spots, isLoading, isError, refetch } = useSpotsList() as {
    data: Spot[] | undefined;
    isLoading: boolean;
    isError: boolean;
    refetch: () => void;
  };
  const { latitude, longitude } = useLocation();

  const spotIds = useMemo(() => spots?.map((s) => s.id) ?? [], [spots]);
  const { data: thumbnails } = useSpotThumbnails(spotIds);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"recent" | "nearest" | "rating" | "name">("recent");

  const filteredSpots = useMemo(() => {
    if (!spots) return [];
    let result = spots;

    if (selectedCategory) {
      result = result.filter((s) => s.category === selectedCategory);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.description?.toLowerCase().includes(q) ||
          s.address?.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortBy === "nearest" && latitude && longitude) {
      result = [...result].sort((a, b) => {
        const dA = a.latitude && a.longitude ? calculateDistance(latitude, longitude, a.latitude, a.longitude) : Infinity;
        const dB = b.latitude && b.longitude ? calculateDistance(latitude, longitude, b.latitude, b.longitude) : Infinity;
        return dA - dB;
      });
    } else if (sortBy === "rating") {
      result = [...result].sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "name") {
      result = [...result].sort((a, b) => a.title.localeCompare(b.title));
    }
    // "recent" is already sorted by updated_at from API

    return result;
  }, [spots, selectedCategory, search, sortBy, latitude, longitude]);

  const getDistance = useCallback(
    (spot: Spot): number | null => {
      if (!latitude || !longitude || !spot.latitude || !spot.longitude)
        return null;
      return calculateDistance(latitude, longitude, spot.latitude, spot.longitude);
    },
    [latitude, longitude]
  );

  const renderItem = useCallback(
    ({ item }: { item: Spot }) => (
      <SpotCard
        spot={item}
        distance={getDistance(item)}
        thumbnailUrl={thumbnails?.[item.id]}
        onPress={() => router.push(`/(tabs)/spot/${item.id}`)}
      />
    ),
    [getDistance, router, thumbnails]
  );

  if (isLoading && !spots?.length) {
    return <LoadingState message="Loading your spots..." />;
  }

  if (isError && !spots?.length) {
    return (
      <ErrorState
        message="Failed to load spots. Check your connection."
        onRetry={refetch}
      />
    );
  }

  const userName = user?.email ? user.email.split("@")[0] : "";

  const listHeader = (
    <>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatarSmall}>
            <Text style={styles.avatarText}>
              {userName ? userName.charAt(0).toUpperCase() : "U"}
            </Text>
          </View>
          <View>
            <Text style={styles.greeting}>
              Hello, {userName || "there"}
            </Text>
            <Text style={styles.subtitle}>Find your trusted spots</Text>
          </View>
        </View>

      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color={colors.textTertiary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search spots..."
          placeholderTextColor={colors.textTertiary}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch("")}>
            <Ionicons name="close-circle-outline" size={18} color={colors.textTertiary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Category Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipList}
      >
        {["All", ...CATEGORIES].map((item) => {
          const iconName = item === "All" ? "grid-outline" : CATEGORY_ICONS[item];
          return (
            <Chip
              key={item}
              label={item}
              icon={iconName as any}
              selected={
                item === "All" ? selectedCategory === null : selectedCategory === item
              }
              onPress={() => setSelectedCategory(item === "All" ? null : item)}
            />
          );
        })}
      </ScrollView>

      {/* Sort Row */}
      <View style={styles.sortRow}>
        {(["recent", "nearest", "rating", "name"] as const).map((opt) => {
          const labels = { recent: "Recent", nearest: "Nearest", rating: "Top Rated", name: "A-Z" };
          const icons = { recent: "time-outline", nearest: "navigate-outline", rating: "star-outline", name: "text-outline" };
          return (
            <TouchableOpacity
              key={opt}
              style={[styles.sortChip, sortBy === opt && styles.sortChipActive]}
              onPress={() => setSortBy(opt)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={icons[opt] as any}
                size={14}
                color={sortBy === opt ? colors.primary : colors.textTertiary}
              />
              <Text style={[styles.sortChipText, sortBy === opt && styles.sortChipTextActive]}>
                {labels[opt]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Section Header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          {selectedCategory ? selectedCategory : "Your Spots"}
        </Text>
        <Text style={styles.spotCount}>
          {filteredSpots.length} spot{filteredSpots.length !== 1 ? "s" : ""}
        </Text>
      </View>
    </>
  );

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <FlatList
        data={filteredSpots}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={
          <EmptyState
            title={search || selectedCategory ? "No matches" : "No spots yet"}
            message={
              search || selectedCategory
                ? "Try a different search or category."
                : "Tap + to save your first spot."
            }
            actionLabel={!search && !selectedCategory ? "Add Spot" : undefined}
            onAction={
              !search && !selectedCategory
                ? () => router.push("/(tabs)/add")
                : undefined
            }
          />
        }
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refetch}
            tintColor={colors.primary}
          />
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  avatarSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.white,
  },
  greeting: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.small,
    color: colors.textTertiary,
    marginTop: 1,
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: spacing.base,
    paddingVertical: 11,
    marginBottom: spacing.base,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  searchInput: {
    ...typography.body,
    fontSize: 15,
    color: colors.textPrimary,
    flex: 1,
    padding: 0,
  },
  chipList: {
    paddingBottom: spacing.lg,
    gap: 8,
  },
  sortRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  sortChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sortChipActive: {
    backgroundColor: colors.primary + "12",
    borderColor: colors.primary + "30",
  },
  sortChipText: {
    ...typography.small,
    color: colors.textTertiary,
  },
  sortChipTextActive: {
    color: colors.primary,
    fontWeight: "600",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  spotCount: {
    ...typography.small,
    color: colors.textTertiary,
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing["3xl"],
  },
});
