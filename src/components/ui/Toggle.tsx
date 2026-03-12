import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from "react-native";
import { colors, radius, spacing, typography } from "@/theme/tokens";

interface ToggleProps {
  value: boolean;
  onToggle: (value: boolean) => void;
  label?: string;
  style?: ViewStyle;
}

export function Toggle({ value, onToggle, label, style }: ToggleProps) {
  return (
    <TouchableOpacity
      onPress={() => onToggle(!value)}
      activeOpacity={0.7}
      style={[styles.container, style]}
    >
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.track, value && styles.trackActive]}>
        <View style={[styles.thumb, value && styles.thumbActive]} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.base,
  },
  label: {
    ...typography.body,
    color: colors.textPrimary,
    flex: 1,
    marginRight: spacing.base,
  },
  track: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.border,
    justifyContent: "center",
    paddingHorizontal: 2,
  },
  trackActive: {
    backgroundColor: colors.secondary,
  },
  thumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  thumbActive: {
    alignSelf: "flex-end",
  },
});
