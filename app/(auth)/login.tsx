import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import { resetPassword } from "@/services/authService";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { colors, spacing, typography, radius } from "@/theme/tokens";

export default function LoginScreen() {
  const router = useRouter();
  const { signIn, signUp } = useAuth();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const getFriendlyAuthError = (message: string, currentMode: "login" | "signup") => {
    const normalized = message.toLowerCase();

    if (normalized.includes("email rate limit exceeded")) {
      return {
        title: "Too many signup emails",
        message:
          "A confirmation email was already sent recently. Wait about a minute, check Spam, or sign in if the account already exists.",
        switchToLogin: currentMode === "signup",
      };
    }

    if (normalized.includes("user already registered")) {
      return {
        title: "Account already exists",
        message: "This email is already registered. Please sign in instead.",
        switchToLogin: true,
      };
    }

    return {
      title: "Error",
      message: message || "Something went wrong",
      switchToLogin: false,
    };
  };

  const validate = (): boolean => {
    const next: typeof errors = {};
    if (!email.trim()) next.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) next.email = "Enter a valid email";
    if (!password) next.password = "Password is required";
    else if (password.length < 6) next.password = "Minimum 6 characters";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      if (mode === "login") {
        await signIn(email.trim(), password);
      } else {
        await signUp(email.trim(), password);
        Alert.alert(
          "Check your email",
          "We sent you a confirmation link. Please verify your email, then log in."
        );
        setMode("login");
      }
    } catch (err: any) {
      const friendly = getFriendlyAuthError(String(err?.message ?? ""), mode);
      if (friendly.switchToLogin) {
        setMode("login");
      }
      Alert.alert(friendly.title, friendly.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      Alert.alert("Enter your email", "Please enter a valid email address first, then tap 'Forgot password?'.");
      return;
    }
    try {
      await resetPassword(email.trim());
      Alert.alert("Check your email", "We sent a password reset link. Check your inbox and spam folder.");
    } catch (err: any) {
      Alert.alert("Error", err.message ?? "Failed to send reset email");
    }
  };

  const toggleMode = () => {
    setMode((prev) => (prev === "login" ? "signup" : "login"));
    setErrors({});
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.title}>
              {mode === "login" ? "Welcome back" : "Create account"}
            </Text>
            <Text style={styles.subtitle}>
              {mode === "login"
                ? "Sign in to access your saved spots."
                : "Start saving your trusted places."}
            </Text>
          </View>

          <View style={styles.form}>
            <Input
              label="Email"
              value={email}
              onChangeText={setEmail}
              error={errors.email}
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
            <Input
              label="Password"
              value={password}
              onChangeText={setPassword}
              error={errors.password}
              placeholder="••••••••"
              secureTextEntry
              autoCapitalize="none"
              autoComplete="password"
            />

            <Button
              title={mode === "login" ? "Sign In" : "Sign Up"}
              onPress={handleSubmit}
              loading={loading}
              fullWidth
              style={styles.submitButton}
            />

            {mode === "login" && (
              <Button
                title="Forgot password?"
                onPress={handleForgotPassword}
                variant="ghost"
                fullWidth
                style={styles.forgotButton}
              />
            )}

            <Button
              title={
                mode === "login"
                  ? "Don't have an account? Sign Up"
                  : "Already have an account? Sign In"
              }
              onPress={toggleMode}
              variant="ghost"
              fullWidth
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing["2xl"],
  },
  header: {
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.h1,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textTertiary,
    lineHeight: 20,
  },
  form: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
  },
  submitButton: {
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  forgotButton: {
    marginBottom: spacing.xs,
  },
});
