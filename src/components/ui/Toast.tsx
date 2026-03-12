import React, { useEffect, useRef } from "react";
import { Animated, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, typography, radius } from "@/theme/tokens";

interface ToastProps {
  visible: boolean;
  message: string;
  type?: "success" | "error" | "info";
  onHide: () => void;
  duration?: number;
}

const ICONS = {
  success: "checkmark-circle-outline" as const,
  error: "alert-circle-outline" as const,
  info: "information-circle-outline" as const,
};
const COLORS = {
  success: colors.success,
  error: colors.error,
  info: colors.info,
};

export function Toast({
  visible,
  message,
  type = "success",
  onHide,
  duration = 2500,
}: ToastProps) {
  const translateY = useRef(new Animated.Value(-80)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(translateY, { toValue: 0, useNativeDriver: true, tension: 80, friction: 10 }),
        Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();

      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(translateY, { toValue: -80, duration: 250, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0, duration: 250, useNativeDriver: true }),
        ]).start(() => onHide());
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, { transform: [{ translateY }], opacity }]}>
      <Ionicons name={ICONS[type]} size={20} color={COLORS[type]} />
      <Text style={[styles.text, { color: COLORS[type] }]}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 60,
    left: spacing.lg,
    right: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 1000,
  },
  text: {
    ...typography.body,
    fontSize: 14,
    fontWeight: "600",
    flex: 1,
  },
});
