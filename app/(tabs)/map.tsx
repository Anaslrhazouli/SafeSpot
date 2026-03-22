import React, { useMemo, useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker, Callout } from "react-native-maps";
import { useSpotsList } from "@/hooks/useSpots";
import { useLocation } from "@/hooks/useLocation";
import { SpotMarkerCallout } from "@/components/spots/SpotMarkerCallout";
import { Chip } from "@/components/ui/Chip";
import { LoadingState } from "@/components/ui/LoadingState";
import { CATEGORY_COLORS, CATEGORY_ICONS, CATEGORIES } from "@/constants/spots";
import { calculateDistance } from "@/services/locationService";
import { formatDistance } from "@/utils/formatting";
import { colors, spacing, typography, radius, shadows } from "@/theme/tokens";
import type { Spot } from "@/types/spot";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const DEFAULT_REGION = {
  latitude: 48.8566,
  longitude: 2.3522,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

export default function MapScreen() {
  const router = useRouter();
  const TAB_BAR_HEIGHT = 98;
  const { data: spots, isLoading } = useSpotsList() as {
    data: Spot[] | undefined;
    isLoading: boolean;
  };
  const { latitude, longitude, getCurrentPosition } = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const mapRef = useRef<MapView>(null);
  const hasAnimatedToUser = useRef(false);

  const region = useMemo(() => {
    const firstWithCoords = spots?.find((s) => s.latitude && s.longitude);
    if (firstWithCoords) {
      return {
        latitude: firstWithCoords.latitude!,
        longitude: firstWithCoords.longitude!,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };
    }
    return DEFAULT_REGION;
  }, [spots]);

  // Animate to user location as soon as it becomes available
  useEffect(() => {
    if (latitude && longitude && mapRef.current && !hasAnimatedToUser.current) {
      hasAnimatedToUser.current = true;
      mapRef.current.animateToRegion({
        latitude,
        longitude,
        latitudeDelta: 0.03,
        longitudeDelta: 0.03,
      }, 800);
    }
  }, [latitude, longitude]);

  const filteredSpots = useMemo(() => {
    let result = spots?.filter((s) => s.latitude && s.longitude) ?? [];
    if (selectedCategory) {
      result = result.filter((s) => s.category === selectedCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.address?.toLowerCase().includes(q)
      );
    }
    // Sort by nearest if user location is available
    if (latitude && longitude) {
      result.sort((a, b) => {
        const distA = calculateDistance(latitude, longitude, a.latitude!, a.longitude!);
        const distB = calculateDistance(latitude, longitude, b.latitude!, b.longitude!);
        return distA - distB;
      });
    }
    return result;
  }, [spots, selectedCategory, search, latitude, longitude]);

  const getDistance = (spot: Spot): number | null => {
    if (!latitude || !longitude || !spot.latitude || !spot.longitude) return null;
    return calculateDistance(latitude, longitude, spot.latitude, spot.longitude);
  };

  if (isLoading && !spots?.length) {
    return <LoadingState message="Loading map..." />;
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={region}
        showsUserLocation
        showsMyLocationButton={false}
      >
        {filteredSpots.map((spot) => {
          const catColor = CATEGORY_COLORS[spot.category] ?? colors.primary;
          const catIcon = CATEGORY_ICONS[spot.category] ?? "location";
          return (
            <Marker
              key={spot.id}
              coordinate={{
                latitude: spot.latitude!,
                longitude: spot.longitude!,
              }}
            >
              <View style={[styles.markerContainer, { backgroundColor: catColor }]}>
                <Ionicons name={catIcon as any} size={16} color={colors.white} />
              </View>
              <View style={[styles.markerArrow, { borderTopColor: catColor }]} />
              <Callout onPress={() => router.push(`/(tabs)/spot/${spot.id}`)}>
                <SpotMarkerCallout
                  title={spot.title}
                  category={spot.category}
                />
              </Callout>
            </Marker>
          );
        })}
      </MapView>

      {/* Search Overlay */}
      <SafeAreaView style={styles.searchOverlay} edges={["top"]}>
        <View style={[styles.searchBar, shadows.md]}>
          <Ionicons name="search-outline" size={18} color={colors.textTertiary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search on map..."
            placeholderTextColor={colors.textTertiary}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Ionicons name="close-circle" size={18} color={colors.textTertiary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Category chips */}
        <FlatList
          horizontal
          data={["All", ...CATEGORIES]}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipList}
          renderItem={({ item }) => {
            const iconName = item === "All" ? "grid-outline" : CATEGORY_ICONS[item];
            return (
              <Chip
                label={item}
                icon={iconName as any}
                selected={item === "All" ? selectedCategory === null : selectedCategory === item}
                onPress={() => setSelectedCategory(item === "All" ? null : item)}
                style={shadows.sm as any}
              />
            );
          }}
        />
      </SafeAreaView>

      {/* My Location Button */}
      <TouchableOpacity
        style={[styles.myLocationBtn, shadows.md]}
        onPress={async () => {
          if (latitude && longitude && mapRef.current) {
            mapRef.current.animateToRegion({
              latitude,
              longitude,
              latitudeDelta: 0.02,
              longitudeDelta: 0.02,
            });
          } else {
            // Request location permission and get position
            const coords = await getCurrentPosition();
            if (coords && mapRef.current) {
              mapRef.current.animateToRegion({
                latitude: coords.latitude,
                longitude: coords.longitude,
                latitudeDelta: 0.02,
                longitudeDelta: 0.02,
              });
            } else {
              Alert.alert("Location unavailable", "Enable location permissions in Settings.");
            }
          }
        }}
      >
        <Ionicons name="navigate" size={20} color={colors.primary} />
      </TouchableOpacity>

      {/* Bottom Sheet */}
      <View style={[styles.bottomSheet, shadows.lg, { paddingBottom: TAB_BAR_HEIGHT }]}>
        <View style={styles.sheetHandle} />
        <Text style={styles.sheetTitle}>
          {filteredSpots.length} Nearby Spot{filteredSpots.length !== 1 ? "s" : ""}
        </Text>
        <FlatList
          horizontal
          data={filteredSpots.slice(0, 10)}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.sheetList}
          renderItem={({ item }) => {
            const catColor = CATEGORY_COLORS[item.category] ?? colors.primary;
            const catIcon = CATEGORY_ICONS[item.category] ?? "location";
            const dist = getDistance(item);
            return (
              <TouchableOpacity
                style={[styles.sheetCard, shadows.sm]}
                onPress={() => router.push(`/(tabs)/spot/${item.id}`)}
                activeOpacity={0.85}
              >
                <View style={[styles.sheetCardIcon, { backgroundColor: catColor + "15" }]}>
                  <Ionicons name={catIcon as any} size={22} color={catColor} />
                </View>
                <Text style={styles.sheetCardTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                <View style={styles.sheetCardMeta}>
                  <Ionicons name="location-outline" size={12} color={colors.textTertiary} />
                  <Text style={styles.sheetCardDist}>
                    {dist != null ? formatDistance(dist) : item.category}
                  </Text>
                </View>
                {item.rating > 0 && (
                  <View style={styles.sheetCardRating}>
                    <Ionicons name="star" size={12} color={colors.warning} />
                    <Text style={styles.sheetRatingText}>{item.rating}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={
            <Text style={styles.sheetEmpty}>No spots on map yet</Text>
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: colors.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  markerArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    alignSelf: "center",
    marginTop: -2,
  },
  searchOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.base,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  searchInput: {
    ...typography.body,
    color: colors.textPrimary,
    flex: 1,
    paddingVertical: 4,
  },
  chipList: {
    gap: spacing.sm,
    paddingBottom: spacing.sm,
  },
  myLocationBtn: {
    position: "absolute",
    right: spacing.base,
    bottom: 270,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    justifyContent: "center",
    alignItems: "center",
  },
  bottomSheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
    minHeight: 180,
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: "center",
    marginBottom: spacing.sm,
  },
  sheetTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.md,
  },
  sheetList: {
    paddingHorizontal: spacing.base,
    gap: spacing.sm,
  },
  sheetCard: {
    width: 140,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sheetCardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  sheetCardTitle: {
    ...typography.caption,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: 4,
  },
  sheetCardMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  sheetCardDist: {
    ...typography.small,
    color: colors.textTertiary,
  },
  sheetCardRating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    marginTop: 4,
  },
  sheetRatingText: {
    ...typography.small,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  sheetEmpty: {
    ...typography.caption,
    color: colors.textTertiary,
    textAlign: "center",
    padding: spacing.xl,
  },
});
