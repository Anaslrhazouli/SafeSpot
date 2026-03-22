import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Alert,
  TextInput,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import Svg, { Defs, RadialGradient, Stop, Ellipse } from "react-native-svg";
import { useAuth } from "@/hooks/useAuth";
import { colors, radius } from "@/theme/tokens";

const { width: SW, height: SH } = Dimensions.get("window");

const G = {
  surface: "rgba(255,255,255,0.88)",
  border: "rgba(0,0,0,0.07)",
  inputBg: "rgba(255,255,255,0.65)",
  text: colors.textPrimary,
  muted: colors.textSecondary,
  dim: colors.textTertiary,
} as const;

function GlowBg() {
  return (
    <Svg width={SW} height={SH} style={StyleSheet.absoluteFill} pointerEvents="none">
      <Defs>
        <RadialGradient id="rg1" cx="50%" cy="50%">
          <Stop offset="0%" stopColor={colors.secondary} stopOpacity="0.14" />
          <Stop offset="100%" stopColor={colors.secondary} stopOpacity="0" />
        </RadialGradient>
        <RadialGradient id="rg2" cx="50%" cy="50%">
          <Stop offset="0%" stopColor={colors.accent} stopOpacity="0.10" />
          <Stop offset="100%" stopColor={colors.accent} stopOpacity="0" />
        </RadialGradient>
      </Defs>
      <Ellipse cx={SW * 0.85} cy={SH * 0.1} rx={SW * 0.5} ry={SH * 0.22} fill="url(#rg1)" />
      <Ellipse cx={SW * 0.1} cy={SH * 0.88} rx={SW * 0.4} ry={SH * 0.18} fill="url(#rg2)" />
    </Svg>
  );
}

export default function RegisterScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { signUp } = useAuth();

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    displayName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const cardY = useSharedValue(40);
  const cardOp = useSharedValue(0);

  useEffect(() => {
    cardY.value = withSpring(0, { damping: 18, stiffness: 90 });
    cardOp.value = withTiming(1, { duration: 400 });
  }, []);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: cardY.value }],
    opacity: cardOp.value,
  }));

  const validate = (): boolean => {
    const next: typeof errors = {};
    if (!email.trim()) next.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) next.email = "Enter a valid email";
    if (!password) next.password = "Password is required";
    else if (password.length < 6) next.password = "At least 6 characters";
    if (!confirmPassword) next.confirmPassword = "Please confirm your password";
    else if (password !== confirmPassword) next.confirmPassword = "Passwords do not match";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSignUp = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await signUp(
        email.trim(),
        password,
        displayName.trim() || undefined
      );
      Alert.alert(
        "Account created",
        "Check your email to confirm your account, then sign in.",
        [{ text: "Sign In", onPress: () => router.replace("/(auth)/login" as any) }]
      );
    } catch (err: any) {
      Alert.alert("Sign up failed", err?.message ?? "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <GlowBg />

      <TouchableOpacity
        style={[styles.backBtn, { top: insets.top + 12 }]}
        onPress={() => router.back()}
        activeOpacity={0.6}
      >
        <Ionicons name="chevron-back" size={14} color={G.muted} />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            { paddingTop: insets.top + 60, paddingBottom: insets.bottom + 32 },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoMark}>
              <Ionicons name="location" size={22} color={colors.white} />
            </View>
            <Text style={styles.title}>Create account</Text>
            <Text style={styles.subtitle}>Join SafeSpot and save your trusted places</Text>
          </View>

          {/* Form card */}
          <Animated.View style={[styles.card, cardStyle]}>
            {/* Display name */}
            <View style={styles.field}>
              <Text style={styles.label}>
                Name <Text style={styles.optional}>(optional)</Text>
              </Text>
              <View style={[styles.inputRow, errors.displayName ? styles.inputRowError : undefined]}>
                <Ionicons name="person-outline" size={16} color={G.dim} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={displayName}
                  onChangeText={setDisplayName}
                  placeholder="Your name"
                  placeholderTextColor={G.dim}
                  autoCapitalize="words"
                  autoComplete="name"
                />
              </View>
              {errors.displayName ? <Text style={styles.errorText}>{errors.displayName}</Text> : null}
            </View>

            {/* Email */}
            <View style={styles.field}>
              <Text style={styles.label}>Email</Text>
              <View style={[styles.inputRow, errors.email ? styles.inputRowError : undefined]}>
                <Ionicons name="mail-outline" size={16} color={G.dim} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="you@example.com"
                  placeholderTextColor={G.dim}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
              </View>
              {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
            </View>

            {/* Password */}
            <View style={styles.field}>
              <Text style={styles.label}>Password</Text>
              <View style={[styles.inputRow, errors.password ? styles.inputRowError : undefined]}>
                <Ionicons name="lock-closed-outline" size={16} color={G.dim} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Min. 6 characters"
                  placeholderTextColor={G.dim}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity onPress={() => setShowPassword((v) => !v)} style={styles.eyeBtn}>
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={16}
                    color={G.dim}
                  />
                </TouchableOpacity>
              </View>
              {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
            </View>

            {/* Confirm password */}
            <View style={styles.field}>
              <Text style={styles.label}>Confirm password</Text>
              <View style={[styles.inputRow, errors.confirmPassword ? styles.inputRowError : undefined]}>
                <Ionicons name="lock-closed-outline" size={16} color={G.dim} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Repeat your password"
                  placeholderTextColor={G.dim}
                  secureTextEntry={!showConfirm}
                  autoCapitalize="none"
                />
                <TouchableOpacity onPress={() => setShowConfirm((v) => !v)} style={styles.eyeBtn}>
                  <Ionicons
                    name={showConfirm ? "eye-off-outline" : "eye-outline"}
                    size={16}
                    color={G.dim}
                  />
                </TouchableOpacity>
              </View>
              {errors.confirmPassword ? (
                <Text style={styles.errorText}>{errors.confirmPassword}</Text>
              ) : null}
            </View>

            {/* CTA */}
            <TouchableOpacity
              style={[styles.ctaBtn, loading ? { opacity: 0.6 } : undefined]}
              onPress={handleSignUp}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={styles.ctaText}>{loading ? "Creating account…" : "Create Account"}</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Switch to login */}
          <View style={styles.switchRow}>
            <Text style={styles.switchMuted}>Already have an account?  </Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.switchLink}>Sign in →</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  backBtn: {
    position: "absolute",
    left: 20,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 10,
    gap: 4,
  },
  backText: { fontSize: 14, fontWeight: "500", color: G.muted },
  header: { alignItems: "center", marginBottom: 32 },
  logoMark: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  title: { fontSize: 26, fontWeight: "700", color: G.text, marginBottom: 6 },
  subtitle: { fontSize: 15, color: G.muted, textAlign: "center" },
  card: {
    backgroundColor: G.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: G.border,
    padding: 24,
    marginBottom: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  field: { marginBottom: 16 },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: G.muted,
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  optional: {
    fontWeight: "400",
    color: G.dim,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: G.inputBg,
    borderWidth: 1,
    borderColor: G.border,
    borderRadius: radius.sm,
    minHeight: 48,
    paddingHorizontal: 14,
  },
  inputRowError: { borderColor: colors.error },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: G.text, paddingVertical: 0 },
  eyeBtn: { padding: 4, marginLeft: 8 },
  errorText: { fontSize: 12, color: colors.error, marginTop: 5 },
  ctaBtn: {
    height: 52,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  ctaText: { fontSize: 16, fontWeight: "700", color: colors.white },
  switchRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  switchMuted: { fontSize: 14, color: G.muted },
  switchLink: { fontSize: 14, fontWeight: "600", color: colors.primary },
});
