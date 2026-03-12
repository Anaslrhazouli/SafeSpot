import React from "react";
import { View, TouchableOpacity, Text, StyleSheet, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, typography } from "@/theme/tokens";

const RATING_LABELS = ["", "Poor", "Fair", "Good", "Great", "Excellent"];

interface RatingPickerProps {
  value: number;
  onChange: (rating: number) => void;
  max?: number;
  style?: ViewStyle;
  label?: string;
  size?: number;
}

export function RatingPicker({
  value,
  onChange,
  max = 5,
  style,
  label,
}: RatingPickerProps) {
  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.row}>
        <View style={styles.stars}>
          {Array.from({ length: max }, (_, i) => i + 1).map((level) => {
            const active = level <= value;
            return (
              <TouchableOpacity
                key={level}
                onPress={() => onChange(level === value ? 0 : level)}
                activeOpacity={0.7}
                style={[styles.starButton, active && styles.starButtonActive]}
              >
                <Ionicons
                  name={active ? "star" : "star-outline"}
                  size={20}
                  color={active ? colors.warning : colors.textTertiary}
                />
              </TouchableOpacity>
            );
          })}
        </View>
        {value > 0 && (
          <Text style={styles.ratingLabel}>{RATING_LABELS[value]}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.base,
  },
  label: {
    ...typography.caption,
    fontWeight: "600",
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  stars: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  starButton: {
    padding: spacing.xs,
  },
  starButtonActive: {},
  ratingLabel: {
    ...typography.caption,
    fontWeight: "600",
    color: colors.warning,
  },
});
