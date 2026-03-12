import React, { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import { useCreateSpot } from "@/hooks/useSpots";
import { SpotForm } from "@/components/spots/SpotForm";
import { Toast } from "@/components/ui/Toast";
import type { CreateSpotInput } from "@/types/spot";
import { colors } from "@/theme/tokens";

export default function AddSpotScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const createSpot = useCreateSpot();
  const [toast, setToast] = useState({ visible: false, message: "" });

  const toFriendlyError = (message: string) => {
    const normalized = message.toLowerCase();
    if (
      normalized.includes("row level security") ||
      normalized.includes("new row violates")
    ) {
      return "Upload blocked by Supabase RLS policy. Run supabase/migrations/0002_storage_policies.sql in Supabase SQL Editor, then retry.";
    }
    return message || "Failed to create spot";
  };

  const handleSubmit = async (data: CreateSpotInput) => {
    if (!user) return;

    try {
      await createSpot.mutateAsync({
        spot: {
          user_id: user.id,
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
        photoUris: data.photo_uris,
      });

      setToast({ visible: true, message: "Spot saved successfully!" });
      setTimeout(() => router.replace("/(tabs)"), 800);
    } catch (err: any) {
      Alert.alert("Error", toFriendlyError(String(err?.message ?? "")));
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <View style={styles.flex}>
        <SpotForm
          onSubmit={handleSubmit}
          loading={createSpot.isPending}
          submitLabel="Save Spot"
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
