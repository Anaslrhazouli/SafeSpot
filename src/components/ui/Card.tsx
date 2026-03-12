import React, { ReactNode } from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { colors, radius, shadows, spacing } from "@/theme/tokens";

interface CardProps {
  children: ReactNode;
  style?: ViewStyle;
  variant?: "default" | "alt";
}

export function Card({ children, style, variant = "default" }: CardProps) {
  return (
    <View
      style={[
        styles.card,
        variant === "alt" && styles.alt,
        shadows.md,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.base,
  },
  alt: {
    backgroundColor: colors.surfaceAlt,
  },
});
