import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "@/components/ui/Button";
import { colors, spacing, typography, radius } from "@/theme/tokens";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.hero}>
          <View style={styles.iconOuter}>
            <View style={styles.iconCircle}>
              <Ionicons name="location-outline" size={32} color={colors.white} />
            </View>
          </View>
          <Text style={styles.title}>SafeSpot</Text>
          <Text style={styles.subtitle}>Student</Text>
          <Text style={styles.tagline}>
            Your personal map of trusted places.{"\n"}
            Save cafés, safe spots, quiet corners{"\n"}
            and every place that matters to you.
          </Text>

          {/* Feature highlights */}
          <View style={styles.features}>
            {[
              { icon: "shield-checkmark-outline" as const, label: "Safe spots" },
              { icon: "cafe-outline" as const, label: "Quiet cafés" },
              { icon: "wifi-outline" as const, label: "Work-friendly" },
            ].map((f) => (
              <View key={f.label} style={styles.featurePill}>
                <Ionicons name={f.icon} size={14} color={colors.primary} />
                <Text style={styles.featureText}>{f.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.actions}>
          <Button
            title="Get Started"
            onPress={() => router.push("/(auth)/login")}
            fullWidth
          />
          <Text style={styles.hint}>
            Sign up or log in to start saving spots.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing["3xl"],
    paddingTop: spacing.xl,
  },
  hero: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  iconOuter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary + "10",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    ...typography.display,
    color: colors.primary,
    textAlign: "center",
  },
  subtitle: {
    ...typography.h2,
    color: colors.secondary,
    marginBottom: spacing.lg,
    textAlign: "center",
  },
  tagline: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
  },
  features: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.xl,
  },
  featurePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
  },
  featureText: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.textSecondary,
  },
  actions: {
    gap: spacing.md,
    alignItems: "center",
  },
  hint: {
    ...typography.small,
    color: colors.textTertiary,
    textAlign: "center",
  },
});
