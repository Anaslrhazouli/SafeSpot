import React from "react";
import { View, ActivityIndicator, Text, StyleSheet } from "react-native";
import { colors, spacing, typography } from "@/theme/tokens";

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = "Loading…" }: LoadingStateProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing["2xl"],
  },
  text: {
    ...typography.caption,
    color: colors.textTertiary,
    marginTop: spacing.base,
  },
});
