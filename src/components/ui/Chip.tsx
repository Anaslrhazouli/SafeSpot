import React from "react";
import { TouchableOpacity, Text, View, StyleSheet, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius, spacing, typography } from "@/theme/tokens";

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
  icon?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
}

export function Chip({ label, selected = false, onPress, style, icon, iconColor }: ChipProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress}
      style={[styles.chip, selected && styles.selected, style]}
    >
      <View style={styles.inner}>
        {icon && (
          <Ionicons
            name={icon}
            size={14}
            color={selected ? colors.white : (iconColor ?? colors.textSecondary)}
            style={styles.icon}
          />
        )}
        <Text style={[styles.text, selected && styles.selectedText]}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 6,
    marginBottom: 4,
  },
  selected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  inner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  icon: {
    marginRight: 0,
  },
  text: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.textSecondary,
  },
  selectedText: {
    color: colors.white,
    fontWeight: "600",
  },
});
