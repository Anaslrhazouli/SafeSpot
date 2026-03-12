import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  Alert,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Platform,
  Share,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useSpotDetail, useSpotTags, useSpotPhotos, useDeleteSpot, useUpdateSpot } from "@/hooks/useSpots";
import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Toast } from "@/components/ui/Toast";
import { formatDate } from "@/utils/formatting";
import { CATEGORY_ICONS, CATEGORY_COLORS, TAG_ICONS } from "@/constants/spots";
import { colors, spacing, typography, radius } from "@/theme/tokens";

export default function SpotDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: spot, isLoading, isError, refetch } = useSpotDetail(id);
  const { data: tags } = useSpotTags(id);
  const { data: photos } = useSpotPhotos(id);
  const deleteSpot = useDeleteSpot();
  const updateSpot = useUpdateSpot();
  const [toast, setToast] = useState({ visible: false, message: "" });

  const handleToggleFavorite = async () => {
    if (!spot || !id) return;
    try {
      await updateSpot.mutateAsync({
        id,
        spot: { is_favorite: !spot.is_favorite },
        tags: [],
        newPhotoUris: [],
      });
    } catch (err: any) {
      Alert.alert("Error", err.message ?? "Failed to update");
    }
  };

  const handleDelete = () => {
    Alert.alert("Remove Spot", "Are you sure you want to remove this spot?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteSpot.mutateAsync(id!);
            setToast({ visible: true, message: "Spot removed" });
            setTimeout(() => router.back(), 800);
          } catch (err: any) {
            Alert.alert("Error", err.message ?? "Failed to delete");
          }
        },
      },
    ]);
  };

  const handleDirections = () => {
    if (!spot?.latitude || !spot?.longitude) return;
    const url = Platform.select({
      ios: `maps:0,0?q=${spot.latitude},${spot.longitude}`,
      android: `geo:0,0?q=${spot.latitude},${spot.longitude}(${encodeURIComponent(spot.title)})`,
    });
    if (url) Linking.openURL(url);
  };

  const handleShare = async () => {
    if (!spot) return;
    const parts = [`${spot.title}`];
    if (spot.category) parts.push(`Category: ${spot.category}`);
    if (spot.address) parts.push(`Address: ${spot.address}`);
    if (spot.rating > 0) parts.push(`Rating: ${spot.rating}/5`);
    if (spot.description) parts.push(`\n"${spot.description}"`);
    parts.push("\nShared from SafeSpot Student");

    try {
      await Share.share({ message: parts.join("\n") });
    } catch {}
  };

  if (isLoading) return <LoadingState />;
  if (isError || !spot) {
    return (
      <ErrorState
        message="Spot not found or failed to load."
        onRetry={refetch}
      />
    );
  }

  const catIcon = CATEGORY_ICONS[spot.category] ?? "location";
  const catColor = CATEGORY_COLORS[spot.category] ?? colors.primary;
  const heroPhoto = photos && photos.length > 0 ? photos[0].image_url : null;

  // Trust indicators
  const trustItems = [
    {
      icon: "star-outline" as const,
      label: "Rating",
      value: spot.rating > 0 ? `${spot.rating}/5` : "N/A",
      color: colors.warning,
    },
    {
      icon: "moon-outline" as const,
      label: "Night Safety",
      value: spot.is_safe_at_night ? "Safe" : "Unknown",
      color: spot.is_safe_at_night ? colors.success : colors.textTertiary,
    },
    {
      icon: catIcon as any,
      label: "Category",
      value: spot.category,
      color: catColor,
    },
    {
      icon: "heart-outline" as const,
      label: "Saved",
      value: spot.is_favorite ? "Favorite" : "No",
      color: spot.is_favorite ? colors.accent : colors.textTertiary,
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        {/* Hero Image */}
        <View style={styles.heroContainer}>
          {heroPhoto ? (
            <Image source={{ uri: heroPhoto }} style={styles.heroImage} />
          ) : (
            <View style={[styles.heroImage, styles.heroPlaceholder, { backgroundColor: catColor + "20" }]}>
              <Ionicons name={catIcon as any} size={64} color={catColor} />
            </View>
          )}

          {/* Gradient overlay */}
          <View style={styles.heroOverlay} />

          {/* Back button */}
          <SafeAreaView style={styles.heroTopBar} edges={["top"]}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.backButton} onPress={handleToggleFavorite}>
              <Ionicons
                name={spot.is_favorite ? "heart" : "heart-outline"}
                size={22}
                color={spot.is_favorite ? colors.accent : colors.textPrimary}
              />
            </TouchableOpacity>
          </SafeAreaView>

          {/* Category badge on image */}
          <View style={[styles.heroBadge, { backgroundColor: catColor }]}>
            <Ionicons name={catIcon as any} size={12} color={colors.white} />
            <Text style={styles.heroBadgeText}>{spot.category}</Text>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Title & Rating */}
          <View style={styles.titleRow}>
            <Text style={styles.title}>{spot.title}</Text>
            {spot.rating > 0 && (
              <View style={styles.ratingBadge}>
                <Ionicons name="star-outline" size={14} color={colors.warning} />
                <Text style={styles.ratingText}>{spot.rating}.0</Text>
              </View>
            )}
          </View>

          {/* Address */}
          {spot.address && (
            <View style={styles.addressRow}>
              <Ionicons name="location-outline" size={16} color={colors.textSecondary} />
              <Text style={styles.addressText}>{spot.address}</Text>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            {spot.latitude && spot.longitude && (
              <TouchableOpacity style={styles.actionBtn} onPress={handleDirections}>
                <Ionicons name="navigate-outline" size={18} color={colors.primary} />
                <Text style={styles.actionBtnText}>Directions</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.actionBtn} onPress={handleShare}>
              <Ionicons name="share-outline" size={18} color={colors.info} />
              <Text style={styles.actionBtnText}>Share</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => router.push(`/(tabs)/spot/edit/${id}`)}
            >
              <Ionicons name="create-outline" size={18} color={colors.secondary} />
              <Text style={styles.actionBtnText}>Edit</Text>
            </TouchableOpacity>
          </View>

          {/* Trust Indicators */}
          <Text style={styles.sectionTitle}>Trust Indicators</Text>
          <View style={styles.trustGrid}>
            {trustItems.map((item) => (
              <View key={item.label} style={styles.trustCard}>
                <Ionicons name={item.icon as any} size={20} color={item.color} />
                <Text style={styles.trustValue}>{item.value}</Text>
                <Text style={styles.trustLabel}>{item.label}</Text>
              </View>
            ))}
          </View>

          {/* Tags */}
          {tags && tags.length > 0 && (
            <View style={styles.tagsSection}>
              <Text style={styles.sectionTitle}>Tags</Text>
              <View style={styles.tagsRow}>
                {tags.map((tag) => {
                  const tagIcon = TAG_ICONS[tag.label];
                  return (
                    <View key={tag.id} style={styles.tagChip}>
                      {tagIcon && (
                        <Ionicons name={tagIcon as any} size={12} color={colors.textSecondary} />
                      )}
                      <Text style={styles.tagText}>{tag.label}</Text>
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          {/* Private Notes */}
          {spot.description && (
            <View style={styles.notesCard}>
              <View style={styles.notesHeader}>
                <Ionicons name="lock-closed-outline" size={16} color={colors.textSecondary} />
                <Text style={styles.notesTitle}>My Private Notes</Text>
              </View>
              <Text style={styles.notesText}>{spot.description}</Text>
            </View>
          )}

          {/* More Photos */}
          {photos && photos.length > 1 && (
            <View style={styles.photosSection}>
              <Text style={styles.sectionTitle}>Photos</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.photosRow}>
                  {photos.slice(1).map((photo) => (
                    <Image
                      key={photo.id}
                      source={{ uri: photo.image_url }}
                      style={styles.photoThumb}
                    />
                  ))}
                </View>
              </ScrollView>
            </View>
          )}

          {/* Date info */}
          <Text style={styles.dateText}>
            Added {formatDate(spot.created_at)}
            {spot.updated_at !== spot.created_at &&
              ` · Updated ${formatDate(spot.updated_at)}`}
          </Text>

          {/* Delete */}
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Ionicons name="trash-outline" size={18} color={colors.error} />
            <Text style={styles.deleteText}>Remove from my spots</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Toast visible={toast.visible} message={toast.message} onHide={() => setToast({ visible: false, message: "" })} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  heroContainer: {
    height: 260,
    position: "relative",
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  heroPlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  heroOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: "transparent",
  },
  heroTopBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.92)",
    justifyContent: "center",
    alignItems: "center",
  },
  heroBadge: {
    position: "absolute",
    bottom: spacing.md,
    left: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
    gap: 4,
  },
  heroBadgeText: {
    fontSize: 11,
    color: colors.white,
    fontWeight: "700",
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: 120,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
    flex: 1,
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: colors.warning + "12",
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.pill,
    marginLeft: spacing.sm,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  addressText: {
    ...typography.caption,
    color: colors.textTertiary,
    flex: 1,
  },
  actionButtons: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  sectionTitle: {
    ...typography.small,
    fontWeight: "600",
    color: colors.textTertiary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
    paddingLeft: 2,
  },
  trustGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  trustCard: {
    width: "47%",
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    alignItems: "center",
    gap: 4,
  },
  trustValue: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  trustLabel: {
    ...typography.small,
    color: colors.textTertiary,
  },
  tagsSection: {
    marginBottom: spacing.xl,
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  tagChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  tagText: {
    ...typography.small,
    color: colors.textSecondary,
  },
  notesCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.base,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  notesHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  notesTitle: {
    ...typography.small,
    fontWeight: "600",
    color: colors.textTertiary,
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  notesText: {
    ...typography.body,
    color: colors.textPrimary,
    lineHeight: 22,
  },
  photosSection: {
    marginBottom: spacing.xl,
  },
  photosRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  photoThumb: {
    width: 96,
    height: 96,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceAlt,
  },
  dateText: {
    ...typography.small,
    color: colors.textTertiary,
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    paddingVertical: spacing.base,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.error + "25",
  },
  deleteText: {
    fontSize: 14,
    color: colors.error,
    fontWeight: "600",
  },
});
