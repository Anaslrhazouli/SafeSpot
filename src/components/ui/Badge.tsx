import React from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";
import { colors, radius, spacing, typography } from "@/theme/tokens";

type BadgeVariant = "default" | "success" | "warning" | "error" | "info";

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  style?: ViewStyle;
}

const variantColors: Record<BadgeVariant, { bg: string; text: string }> = {
  default: { bg: colors.surfaceAlt, text: colors.textSecondary },
  success: { bg: "#E8F5EC", text: colors.success },
  warning: { bg: "#FDF3E0", text: colors.warning },
  error: { bg: "#FDEAEA", text: colors.error },
  info: { bg: "#E8F0FD", text: colors.info },
};

export function Badge({ label, variant = "default", style }: BadgeProps) {
  const vc = variantColors[variant];
  return (
    <View style={[styles.badge, { backgroundColor: vc.bg }, style]}>
      <Text style={[styles.text, { color: vc.text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
    alignSelf: "flex-start",
  },
  text: {
    ...typography.small,
    fontWeight: "600",
  },
});
