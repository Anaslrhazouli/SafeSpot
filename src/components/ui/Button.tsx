import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from "react-native";
import { colors, radius, spacing, typography } from "@/theme/tokens";

type ButtonVariant = "primary" | "secondary" | "outline" | "danger" | "ghost";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, { bg: string; text: string; border: string }> = {
  primary: { bg: colors.primary, text: colors.white, border: colors.primary },
  secondary: { bg: colors.secondary, text: colors.white, border: colors.secondary },
  outline: { bg: colors.transparent, text: colors.primary, border: colors.primary },
  danger: { bg: colors.error, text: colors.white, border: colors.error },
  ghost: { bg: colors.transparent, text: colors.primary, border: colors.transparent },
};

export function Button({
  title,
  onPress,
  variant = "primary",
  disabled = false,
  loading = false,
  style,
  textStyle,
  fullWidth = false,
}: ButtonProps) {
  const vs = variantStyles[variant];
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
      style={[
        styles.base,
        {
          backgroundColor: vs.bg,
          borderColor: vs.border,
          opacity: isDisabled ? 0.5 : 1,
        },
        fullWidth && styles.fullWidth,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === "outline" || variant === "ghost" ? colors.primary : colors.white}
        />
      ) : (
        <Text style={[styles.text, { color: vs.text }, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.md,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
  },
  fullWidth: {
    width: "100%",
  },
  text: {
    ...typography.body,
    fontWeight: "600",
  },
});
