import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  TextInput,
  FlatList,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Ionicons } from "@expo/vector-icons";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Toggle } from "@/components/ui/Toggle";
import { RatingPicker } from "@/components/ui/RatingPicker";
import { PhotoPicker } from "@/components/ui/PhotoPicker";
import { createSpotSchema, type CreateSpotInput, type Spot, type SpotTag } from "@/types/spot";
import { CATEGORIES, TAGS, CATEGORY_ICONS, TAG_ICONS } from "@/constants/spots";
import { useLocation } from "@/hooks/useLocation";
import { reverseGeocodeAddress } from "@/services/locationService";
import { searchPlaces, getPlaceDetails, reverseGeocode, type PlacePrediction } from "@/services/placesService";
import { colors, spacing, typography, radius } from "@/theme/tokens";

interface SpotFormProps {
  initialData?: Spot | null;
  initialTags?: SpotTag[];
  initialPhotoUrls?: string[];
  onSubmit: (data: CreateSpotInput) => void;
  loading?: boolean;
  submitLabel?: string;
}

export function SpotForm({
  initialData,
  initialTags,
  initialPhotoUrls,
  onSubmit,
  loading = false,
  submitLabel = "Save Spot",
}: SpotFormProps) {
  const { getCurrentPosition, loading: locationLoading } = useLocation();
  const [selectedTags, setSelectedTags] = useState<string[]>(
    initialTags?.map((t) => t.label) ?? []
  );
  const [photoUris, setPhotoUris] = useState<string[]>(initialPhotoUrls ?? []);
  const [newPhotoUris, setNewPhotoUris] = useState<string[]>([]);
  const [addressQuery, setAddressQuery] = useState(initialData?.address ?? "");
  const [suggestions, setSuggestions] = useState<PlacePrediction[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [locationSet, setLocationSet] = useState(
    !!(initialData?.latitude && initialData?.longitude)
  );

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateSpotInput>({
    resolver: zodResolver(createSpotSchema),
    defaultValues: {
      title: initialData?.title ?? "",
      category: initialData?.category ?? "",
      description: initialData?.description ?? "",
      address: initialData?.address ?? "",
      latitude: initialData?.latitude ?? null,
      longitude: initialData?.longitude ?? null,
      rating: initialData?.rating ?? 0,
      is_favorite: initialData?.is_favorite ?? false,
      is_safe_at_night: initialData?.is_safe_at_night ?? false,
      tags: initialTags?.map((t) => t.label) ?? [],
      photo_uris: [],
    },
  });

  // Reset form when initialData changes (edit screen loads different spot)
  React.useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title ?? "",
        category: initialData.category ?? "",
        description: initialData.description ?? "",
        address: initialData.address ?? "",
        latitude: initialData.latitude ?? null,
        longitude: initialData.longitude ?? null,
        rating: initialData.rating ?? 0,
        is_favorite: initialData.is_favorite ?? false,
        is_safe_at_night: initialData.is_safe_at_night ?? false,
        tags: initialTags?.map((t) => t.label) ?? [],
        photo_uris: [],
      });
      setAddressQuery(initialData.address ?? "");
      setSelectedTags(initialTags?.map((t) => t.label) ?? []);
      setPhotoUris(initialPhotoUrls ?? []);
      setNewPhotoUris([]);
      setLocationSet(!!(initialData.latitude && initialData.longitude));
    }
  }, [initialData?.id]);

  const onTagToggle = (tag: string) => {
    setSelectedTags((prev) => {
      const next = prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag];
      setValue("tags", next);
      return next;
    });
  };

  const searchTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleAddressSearch = useCallback((text: string) => {
    setAddressQuery(text);
    setValue("address", text);
    if (text.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    // Debounce: wait 400ms after the user stops typing
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(async () => {
      const results = await searchPlaces(text);
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
    }, 400);
  }, [setValue]);

  const handleSelectPlace = useCallback(async (prediction: PlacePrediction) => {
    setShowSuggestions(false);
    setAddressQuery(prediction.description);
    setValue("address", prediction.description);

    const details = await getPlaceDetails(prediction.place_id);
    if (details) {
      setValue("latitude", details.latitude);
      setValue("longitude", details.longitude);
      setLocationSet(true);
    }
  }, [setValue]);

  const handleLocationPress = async () => {
    const coords = await getCurrentPosition();
    if (coords) {
      setValue("latitude", coords.latitude);
      setValue("longitude", coords.longitude);
      setLocationSet(true);

      // Try Google reverse geocode first (precise address)
      const googleResults = await reverseGeocode(coords.latitude, coords.longitude);
      if (googleResults.length > 0) {
        const best = googleResults[0];
        setAddressQuery(best.description);
        setValue("address", best.description);
      } else {
        // Fallback to Expo reverse geocode
        const address = await reverseGeocodeAddress(coords.latitude, coords.longitude);
        if (address) {
          setAddressQuery(address);
          setValue("address", address);
        }
      }
    } else {
      Alert.alert(
        "Location unavailable",
        "Please enter the address manually or enable location permissions in Settings."
      );
    }
  };

  const handleAddPhoto = (uri: string) => {
    setPhotoUris((prev) => [...prev, uri]);
    setNewPhotoUris((prev) => [...prev, uri]);
  };

  const handleRemovePhoto = (index: number) => {
    const removed = photoUris[index];
    setPhotoUris((prev) => prev.filter((_, i) => i !== index));
    setNewPhotoUris((prev) => prev.filter((u) => u !== removed));
  };

  const onFormSubmit = (data: CreateSpotInput) => {
    onSubmit({
      ...data,
      tags: selectedTags,
      photo_uris: initialData ? newPhotoUris : photoUris,
    });

    // Reset the form if this is a create (not edit)
    if (!initialData) {
      reset({
        title: "",
        category: "",
        description: "",
        address: "",
        latitude: null,
        longitude: null,
        rating: 0,
        is_favorite: false,
        is_safe_at_night: false,
        tags: [],
        photo_uris: [],
      });
      setSelectedTags([]);
      setPhotoUris([]);
      setNewPhotoUris([]);
      setAddressQuery("");
      setLocationSet(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.flex}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <Controller
          control={control}
          name="title"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Spot Name"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.title?.message}
              placeholder="e.g. Quiet Library Cafe"
            />
          )}
        />

        {/* Category */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Category</Text>
          <View style={styles.chips}>
            <Controller
              control={control}
              name="category"
              render={({ field: { value, onChange } }) => (
                <>
                  {CATEGORIES.map((cat) => (
                    <Chip
                      key={cat}
                      label={cat}
                      icon={CATEGORY_ICONS[cat] as any}
                      selected={value === cat}
                      onPress={() => onChange(cat)}
                    />
                  ))}
                </>
              )}
            />
          </View>
          {errors.category && (
            <Text style={styles.error}>{errors.category.message}</Text>
          )}
        </View>

        {/* Location Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Location</Text>

          {/* GPS Button */}
          <TouchableOpacity
            style={styles.locationButton}
            onPress={handleLocationPress}
            disabled={locationLoading}
            activeOpacity={0.7}
          >
            <View style={styles.locationIconCircle}>
              <Ionicons name="navigate-outline" size={18} color={colors.primary} />
            </View>
            <View style={styles.locationButtonContent}>
              <Text style={styles.locationButtonText}>
                {locationLoading ? "Getting location..." : "Use current location"}
              </Text>
              <Text style={styles.locationButtonSub}>Auto-detect your position</Text>
            </View>
            <Ionicons name="chevron-forward-outline" size={16} color={colors.textTertiary} />
          </TouchableOpacity>

          {/* Or divider */}
          <View style={styles.orDivider}>
            <View style={styles.orLine} />
            <Text style={styles.orText}>or search</Text>
            <View style={styles.orLine} />
          </View>

          {/* Address search */}
          <View style={styles.searchBox}>
            <Ionicons name="search-outline" size={18} color={colors.textTertiary} />
            <TextInput
              style={styles.addressInput}
              placeholder="Search for an address..."
              placeholderTextColor={colors.textTertiary}
              value={addressQuery}
              onChangeText={handleAddressSearch}
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            />
          </View>

          {/* Place Suggestions */}
          {showSuggestions && (
            <View style={styles.suggestionsContainer}>
              {suggestions.map((item) => (
                <TouchableOpacity
                  key={item.place_id}
                  style={styles.suggestionRow}
                  onPress={() => handleSelectPlace(item)}
                >
                  <Ionicons name="location-outline" size={16} color={colors.textSecondary} />
                  <Text style={styles.suggestionText} numberOfLines={2}>
                    {item.description}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Location set indicator */}
          {locationSet && (
            <View style={styles.locationSetBanner}>
              <Ionicons name="checkmark-circle-outline" size={16} color={colors.success} />
              <Text style={styles.locationSetText}>Location coordinates set</Text>
            </View>
          )}
        </View>

        {/* Description / Notes */}
        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Private Notes"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.description?.message}
              placeholder="What makes this place special?"
              multiline
              numberOfLines={3}
              style={styles.textArea}
            />
          )}
        />

        {/* Rating */}
        <Controller
          control={control}
          name="rating"
          render={({ field: { value, onChange } }) => (
            <RatingPicker label="Your Rating" value={value} onChange={onChange} />
          )}
        />

        {/* Toggles */}
        <View style={styles.toggleSection}>
          <Controller
            control={control}
            name="is_safe_at_night"
            render={({ field: { value, onChange } }) => (
              <View style={styles.toggleRow}>
                <View style={styles.toggleLabelRow}>
                  <Ionicons name="moon-outline" size={18} color={colors.textSecondary} />
                  <Text style={styles.toggleLabel}>Safe at Night</Text>
                </View>
                <Toggle value={value} onToggle={onChange} />
              </View>
            )}
          />
          <Controller
            control={control}
            name="is_favorite"
            render={({ field: { value, onChange } }) => (
              <View style={styles.toggleRow}>
                <View style={styles.toggleLabelRow}>
                  <Ionicons name="heart-outline" size={18} color={colors.textSecondary} />
                  <Text style={styles.toggleLabel}>Favorite</Text>
                </View>
                <Toggle value={value} onToggle={onChange} />
              </View>
            )}
          />
        </View>

        {/* Tags */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Tags</Text>
          <View style={styles.chips}>
            {TAGS.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                icon={TAG_ICONS[tag] as any}
                selected={selectedTags.includes(tag)}
                onPress={() => onTagToggle(tag)}
              />
            ))}
          </View>
        </View>

        {/* Photos */}
        <PhotoPicker
          photos={photoUris}
          onAdd={handleAddPhoto}
          onRemove={handleRemovePhoto}
        />

        {/* Submit */}
        <TouchableOpacity
          onPress={handleSubmit(onFormSubmit)}
          disabled={loading}
          activeOpacity={0.85}
          style={[styles.submitButton, loading && styles.submitDisabled]}
        >
          {loading ? (
            <Text style={styles.submitText}>Saving...</Text>
          ) : (
            <>
              <Ionicons name="checkmark-circle-outline" size={20} color={colors.white} />
              <Text style={styles.submitText}>{submitLabel}</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: {
    padding: spacing.xl,
    paddingTop: 56,
    paddingBottom: 80,
  },
  section: {
    marginBottom: spacing.base,
  },
  sectionLabel: {
    ...typography.caption,
    fontWeight: "600",
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  error: {
    ...typography.small,
    color: colors.error,
    marginTop: spacing.xs,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  locationButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  locationIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary + "12",
    justifyContent: "center",
    alignItems: "center",
  },
  locationButtonContent: {
    flex: 1,
  },
  locationButtonText: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: "500",
  },
  locationButtonSub: {
    ...typography.small,
    color: colors.textTertiary,
    marginTop: 1,
  },
  orDivider: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginVertical: spacing.md,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  orText: {
    ...typography.small,
    color: colors.textTertiary,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  addressInput: {
    ...typography.body,
    color: colors.textPrimary,
    flex: 1,
    padding: 0,
  },
  suggestionsContainer: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: spacing.sm,
    overflow: "hidden",
  },
  suggestionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  suggestionText: {
    ...typography.caption,
    color: colors.textPrimary,
    flex: 1,
  },
  locationSetBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    padding: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.success + "15",
  },
  locationSetText: {
    ...typography.small,
    color: colors.success,
  },
  toggleSection: {
    marginBottom: spacing.base,
  },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.sm,
  },
  toggleLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  toggleLabel: {
    ...typography.body,
    color: colors.textPrimary,
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.base,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  submitDisabled: {
    opacity: 0.6,
  },
  submitText: {
    ...typography.body,
    fontWeight: "600",
    color: colors.white,
  },
});
