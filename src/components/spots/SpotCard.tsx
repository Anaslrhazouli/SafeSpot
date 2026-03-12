import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, typography, radius } from "@/theme/tokens";
import { CATEGORY_ICONS, CATEGORY_COLORS } from "@/constants/spots";
import { formatDistance } from "@/utils/formatting";
import type { Spot } from "@/types/spot";

interface SpotCardProps {
  spot: Spot;
  distance?: number | null;
  thumbnailUrl?: string | null;
  onPress: () => void;
  tags?: string[];
}

export function SpotCard({ spot, distance, thumbnailUrl, onPress, tags }: SpotCardProps) {
  const catIcon = CATEGORY_ICONS[spot.category] ?? "location";
  const catColor = CATEGORY_COLORS[spot.category] ?? colors.primary;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.wrapper}>
      <View style={styles.card}>
        {/* Image */}
        <View style={styles.imageContainer}>
          {thumbnailUrl ? (
            <Image source={{ uri: thumbnailUrl }} style={styles.image} />
          ) : (
            <View style={[styles.image, styles.placeholderImage, { backgroundColor: catColor + "10" }]}>
              <Ionicons name={catIcon as any} size={36} color={catColor} />
            </View>
          )}

          {/* Category pill */}
          <View style={[styles.categoryBadge, { backgroundColor: catColor }]}>
            <Ionicons name={catIcon as any} size={11} color={colors.white} />
            <Text style={styles.categoryText}>{spot.category}</Text>
          </View>

          {/* Favorite */}
          {spot.is_favorite && (
            <View style={styles.heartContainer}>
              <Ionicons name="heart-outline" size={18} color={colors.accent} />
            </View>
          )}
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Text style={styles.title} numberOfLines={1}>{spot.title}</Text>
            {spot.rating > 0 && (
              <View style={styles.ratingBadge}>
                <Ionicons name="star-outline" size={12} color={colors.warning} />
                <Text style={styles.ratingText}>{spot.rating}</Text>
              </View>
            )}
          </View>

          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={13} color={colors.textTertiary} />
            <Text style={styles.address} numberOfLines={1}>
              {spot.address || "No address"}
            </Text>
            {distance != null && (
              <Text style={styles.distance}>{formatDistance(distance)}</Text>
            )}
          </View>

          {/* Badges */}
          {(spot.is_safe_at_night || (tags && tags.length > 0)) && (
            <View style={styles.badgesRow}>
              {spot.is_safe_at_night && (
                <View style={styles.safeBadge}>
                  <Ionicons name="moon-outline" size={11} color={colors.success} />
                  <Text style={styles.safeText}>Safe at night</Text>
                </View>
              )}
              {tags && tags.slice(0, 3).map((tag) => (
                <View key={tag} style={styles.tagChip}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  imageContainer: {
    height: 150,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  placeholderImage: {
    justifyContent: "center",
    alignItems: "center",
  },
  categoryBadge: {
    position: "absolute",
    top: spacing.sm,
    left: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
    gap: 4,
  },
  categoryText: {
    fontSize: 11,
    color: colors.white,
    fontWeight: "700",
  },
  heartContainer: {
    position: "absolute",
    top: spacing.sm,
    right: spacing.sm,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(255,255,255,0.92)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    padding: spacing.md,
    gap: 6,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textPrimary,
    flex: 1,
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: colors.warning + "12",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.pill,
    marginLeft: spacing.sm,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  address: {
    ...typography.caption,
    color: colors.textTertiary,
    flex: 1,
  },
  distance: {
    ...typography.small,
    color: colors.primary,
    fontWeight: "600",
  },
  badgesRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 5,
    marginTop: 2,
  },
  safeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: colors.success + "12",
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  safeText: {
    fontSize: 10,
    color: colors.success,
    fontWeight: "600",
  },
  tagChip: {
    backgroundColor: colors.surfaceAlt,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: radius.pill,
    borderWidth: 0.5,
    borderColor: colors.border,
  },
  tagText: {
    fontSize: 10,
    color: colors.textTertiary,
    fontWeight: "500",
  },
});
