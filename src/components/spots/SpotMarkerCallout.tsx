import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CATEGORY_ICONS, CATEGORY_COLORS } from "@/constants/spots";
import { colors, typography, spacing, radius } from "@/theme/tokens";

interface SpotMarkerCalloutProps {
  title: string;
  category: string;
}

export function SpotMarkerCallout({ title, category }: SpotMarkerCalloutProps) {
  const catIcon = CATEGORY_ICONS[category] ?? "location";
  const catColor = CATEGORY_COLORS[category] ?? colors.primary;

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Ionicons name={catIcon as any} size={14} color={catColor} />
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
      </View>
      <Text style={styles.category}>{category}</Text>
      <View style={styles.hintRow}>
        <Text style={styles.hint}>View details</Text>
        <Ionicons name="chevron-forward" size={12} color={colors.primary} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minWidth: 140,
    padding: spacing.sm,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  title: {
    ...typography.caption,
    fontWeight: "700",
    color: colors.textPrimary,
    flex: 1,
  },
  category: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: 2,
  },
  hintRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    marginTop: spacing.xs,
  },
  hint: {
    ...typography.small,
    color: colors.primary,
  },
});
