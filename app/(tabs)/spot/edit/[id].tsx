import React, { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  useSpotDetail,
  useSpotTags,
  useSpotPhotos,
  useUpdateSpot,
} from "@/hooks/useSpots";
import { SpotForm } from "@/components/spots/SpotForm";
import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Toast } from "@/components/ui/Toast";
import type { CreateSpotInput } from "@/types/spot";
import { colors } from "@/theme/tokens";

export default function EditSpotScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: spot, isLoading, isError } = useSpotDetail(id);
  const { data: tags } = useSpotTags(id);
  const { data: photos } = useSpotPhotos(id);
  const updateSpot = useUpdateSpot();
  const [toast, setToast] = useState({ visible: false, message: "" });

  const toFriendlyError = (message: string) => {
    const normalized = message.toLowerCase();
    if (
      normalized.includes("row level security") ||
      normalized.includes("new row violates")
    ) {
      return "Upload blocked by Supabase RLS policy. Run supabase/migrations/0002_storage_policies.sql in Supabase SQL Editor, then retry.";
    }
    return message || "Failed to update";
  };

  const handleSubmit = async (data: CreateSpotInput, removedPhotoUrls?: string[]) => {
    if (!id) return;

    try {
      await updateSpot.mutateAsync({
        id,
        spot: {
          title: data.title,
          category: data.category,
          description: data.description || undefined,
          address: data.address || undefined,
          latitude: data.latitude,
          longitude: data.longitude,
          rating: data.rating,
          is_favorite: data.is_favorite,
          is_safe_at_night: data.is_safe_at_night,
        },
        tags: data.tags,
        newPhotoUris: data.photo_uris,
        removedPhotoUrls: removedPhotoUrls ?? [],
      });

      setToast({ visible: true, message: "Spot updated!" });
      setTimeout(() => router.back(), 800);
    } catch (err: any) {
      Alert.alert("Error", toFriendlyError(String(err?.message ?? "")));
    }
  };

  if (isLoading) return <LoadingState />;
  if (isError || !spot) {
    return <ErrorState message="Spot not found." />;
  }

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <View style={styles.flex}>
        <SpotForm
          initialData={spot}
          initialTags={tags ?? []}
          initialPhotoUrls={photos?.map((p) => p.image_url) ?? []}
          onSubmit={handleSubmit}
          loading={updateSpot.isPending}
          submitLabel="Update Spot"
        />
        <Toast visible={toast.visible} message={toast.message} onHide={() => setToast({ visible: false, message: "" })} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
});
