import React, { useCallback, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  interpolate,
  Extrapolation,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
  Easing,
  runOnJS,
  type SharedValue,
} from "react-native-reanimated";
import Svg, {
  Defs,
  RadialGradient,
  Stop,
  Ellipse,
} from "react-native-svg";
import * as Haptics from "expo-haptics";
import { markOnboardingSeen } from "@/storage/onboarding";
import { colors, spacing, typography, radius } from "@/theme/tokens";

const { width: SW, height: SH } = Dimensions.get("window");
const PAGE_COUNT = 4;

// ─── Onboarding color tokens (mapped to SafeSpot palette) ───────────
const OB = {
  bg: colors.background, // #F7F8F5
  text: colors.textPrimary, // #182028
  textMuted: colors.textSecondary, // #5E6873
  textDim: colors.textTertiary, // #8A939C
  textFaint: colors.border, // #D9DED6
  border: "rgba(0,0,0,0.06)",
  borderHover: "rgba(0,0,0,0.12)",
  surface: colors.surface, // #FFFFFF
  surfaceRaised: "rgba(255,255,255,0.85)",
  cardBg: "rgba(255,255,255,0.92)",
  glowPrimary: colors.primary, // #1F3A5F – brand blue glow
  glowAccent: colors.accent, // #E9846E – warm accent CTA
  glowSecondary: colors.secondary, // #7FA38A – green secondary
} as const;

// ─── Page data ──────────────────────────────────────────────────────
interface Page {
  tagIcon: keyof typeof Ionicons.glyphMap;
  tagText: string;
  headline: string;
  body: string;
  visual: "discover" | "safety" | "organize" | "cta";
}

const PAGES: Page[] = [
  {
    tagIcon: "compass-outline",
    tagText: "Discover",
    headline: "Save the Places\nYou Trust",
    body: "Bookmark quiet cafés, safe streets, study corners — all your trusted spots in one place.",
    visual: "discover",
  },
  {
    tagIcon: "shield-checkmark-outline",
    tagText: "Safety",
    headline: "Feel Safe\nEverywhere",
    body: "Mark spots that are safe at night, well-lit, and accessible. Your personal safety map.",
    visual: "safety",
  },
  {
    tagIcon: "layers-outline",
    tagText: "Organize",
    headline: "Organize\nYour World",
    body: "Categorize, tag, and rate your spots. Find what you need in seconds.",
    visual: "organize",
  },
  {
    tagIcon: "navigate-outline",
    tagText: "Get Started",
    headline: "Your Map\nAwaits",
    body: "Use your location to discover trusted spots nearby. Start building your personal city guide.",
    visual: "cta",
  },
];

const PAGE_PROOF = [
  [
    { value: "8+", label: "Categories" },
    { value: "∞", label: "Spots" },
    { value: "24/7", label: "Access" },
  ],
  [
    { value: "Safe", label: "At Night" },
    { value: "Tags", label: "Custom" },
    { value: "Rate", label: "1-5 Stars" },
  ],
  [
    { value: "GPS", label: "Location" },
    { value: "Sort", label: "Nearby" },
    { value: "Sync", label: "Cloud" },
  ],
];

// ─── Animated SVG components ────────────────────────────────────────
const AnimatedEllipse = Animated.createAnimatedComponent(Ellipse);

// ─── Glow Background ───────────────────────────────────────────────
function GlowBackground() {
  const o1 = useSharedValue(0.12);
  const o2 = useSharedValue(0.06);
  const o3 = useSharedValue(0.08);
  const o4 = useSharedValue(0.05);

  useEffect(() => {
    o1.value = withRepeat(
      withSequence(
        withTiming(0.16, { duration: 6000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.09, { duration: 6000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
    o2.value = withRepeat(
      withSequence(
        withTiming(0.08, { duration: 5000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.04, { duration: 5000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
    o3.value = withRepeat(
      withSequence(
        withTiming(0.1, { duration: 7000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.06, { duration: 7000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
    o4.value = withRepeat(
      withSequence(
        withTiming(0.07, { duration: 4500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.03, { duration: 4500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const style1 = useAnimatedStyle(() => ({ opacity: o1.value }));
  const style2 = useAnimatedStyle(() => ({ opacity: o2.value }));
  const style3 = useAnimatedStyle(() => ({ opacity: o3.value }));
  const style4 = useAnimatedStyle(() => ({ opacity: o4.value }));

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width={SW} height={SH} style={StyleSheet.absoluteFill}>
        <Defs>
          <RadialGradient id="g1" cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="0%" stopColor={OB.glowPrimary} stopOpacity="1" />
            <Stop offset="100%" stopColor={OB.glowPrimary} stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id="g2" cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="0%" stopColor={OB.glowAccent} stopOpacity="1" />
            <Stop offset="100%" stopColor={OB.glowAccent} stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id="g3" cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="0%" stopColor={OB.glowSecondary} stopOpacity="1" />
            <Stop offset="100%" stopColor={OB.glowSecondary} stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Animated.View style={style1}>
          <Ellipse cx={SW * 0.2} cy={SH * 0.15} rx={SW * 0.45} ry={SH * 0.2} fill="url(#g1)" />
        </Animated.View>
        <Animated.View style={style2}>
          <Ellipse cx={SW * 0.85} cy={SH * 0.1} rx={SW * 0.35} ry={SH * 0.15} fill="url(#g2)" />
        </Animated.View>
        <Animated.View style={style3}>
          <Ellipse cx={SW * 0.5} cy={SH * 0.45} rx={SW * 0.3} ry={SH * 0.12} fill="url(#g3)" />
        </Animated.View>
        <Animated.View style={style4}>
          <Ellipse cx={SW * 0.75} cy={SH * 0.8} rx={SW * 0.25} ry={SH * 0.1} fill="url(#g2)" />
        </Animated.View>
      </Svg>
    </View>
  );
}

// ─── Glass Pill ─────────────────────────────────────────────────────
function GlassPill({
  icon,
  text,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  text: string;
}) {
  return (
    <View style={styles.glassPill}>
      <Ionicons name={icon} size={12} color={OB.glowAccent} />
      <Text style={styles.glassPillText}>{text}</Text>
    </View>
  );
}

// ─── Floating Icon ──────────────────────────────────────────────────
function FloatingIcon({
  icon,
  color,
  top,
  left,
  delay = 0,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  top: number;
  left: number;
  delay?: number;
}) {
  const ty = useSharedValue(0);
  const tx = useSharedValue(0);

  useEffect(() => {
    const yDuration = 3600 + delay * 3;
    const xDuration = 4600 + delay * 2;
    ty.value = withRepeat(
      withSequence(
        withTiming(-12, { duration: yDuration, easing: Easing.inOut(Easing.ease) }),
        withTiming(8, { duration: yDuration * 0.8, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: yDuration * 0.6, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
    tx.value = withRepeat(
      withSequence(
        withTiming(-7, { duration: xDuration, easing: Easing.inOut(Easing.ease) }),
        withTiming(7, { duration: xDuration, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const floatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: ty.value }, { translateX: tx.value }],
  }));

  return (
    <Animated.View style={[styles.floatingIcon, { top, left }, floatStyle]}>
      <Ionicons name={icon} size={16} color={color} />
    </Animated.View>
  );
}

// ─── Icon Constellation ─────────────────────────────────────────────
function IconConstellation({
  centerIcon,
  centerColor,
  satellites,
}: {
  centerIcon: keyof typeof Ionicons.glyphMap;
  centerColor: string;
  satellites: {
    icon: keyof typeof Ionicons.glyphMap;
    color: string;
    top: number;
    left: number;
    delay: number;
  }[];
}) {
  const pulse = useSharedValue(1);

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.06, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 2500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  return (
    <View style={styles.constellationContainer}>
      {/* Center glow */}
      <Svg
        width={140}
        height={140}
        style={{ position: "absolute", top: (SH * 0.25 - 140) / 2, left: (SW * 0.7 - 140) / 2 }}
      >
        <Defs>
          <RadialGradient id="cg" cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="0%" stopColor={centerColor} stopOpacity="0.2" />
            <Stop offset="100%" stopColor={centerColor} stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Ellipse cx={70} cy={70} rx={70} ry={70} fill="url(#cg)" />
      </Svg>

      {/* Center icon */}
      <Animated.View style={[styles.centerIcon, pulseStyle]}>
        <Ionicons name={centerIcon} size={28} color={centerColor} />
      </Animated.View>

      {/* Satellites */}
      {satellites.map((s, i) => (
        <FloatingIcon key={i} icon={s.icon} color={s.color} top={s.top} left={s.left} delay={s.delay} />
      ))}
    </View>
  );
}

// ─── Step Cards ─────────────────────────────────────────────────────
function StepCards() {
  const steps = [
    { num: "01", label: "Pick a spot", icon: "location-outline" as const, color: OB.glowPrimary },
    { num: "02", label: "Add details", icon: "create-outline" as const, color: OB.glowAccent },
    { num: "03", label: "Save & find later", icon: "bookmark-outline" as const, color: OB.glowSecondary },
  ];

  return (
    <View style={styles.stepCardsContainer}>
      {steps.map((step, i) => (
        <View key={i} style={[styles.stepCard, i > 0 && { marginTop: 10 }]}>
          <View style={[styles.stepIconBox, { backgroundColor: step.color + "20" }]}>
            <Ionicons name={step.icon} size={14} color={step.color} />
          </View>
          <View style={{ marginLeft: 14 }}>
            <Text style={styles.stepNum}>{step.num}</Text>
            <Text style={styles.stepLabel}>{step.label}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

// ─── CTA Visual ─────────────────────────────────────────────────────
function CTAVisual() {
  const logoScale = useSharedValue(0.85);

  useEffect(() => {
    logoScale.value = withSpring(1, { damping: 14, stiffness: 80 });
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
  }));

  return (
    <View style={styles.ctaVisualContainer}>
      {/* Glow behind logo */}
      <Svg width={SW * 0.8} height={SW * 0.8} style={styles.ctaGlow}>
        <Defs>
          <RadialGradient id="ctaglow1" cx="30%" cy="35%">
            <Stop offset="0%" stopColor={OB.glowPrimary} stopOpacity="0.2" />
            <Stop offset="60%" stopColor={OB.glowPrimary} stopOpacity="0.05" />
            <Stop offset="100%" stopColor={OB.glowPrimary} stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id="ctaglow2" cx="70%" cy="65%">
            <Stop offset="0%" stopColor={OB.glowAccent} stopOpacity="0.12" />
            <Stop offset="60%" stopColor={OB.glowAccent} stopOpacity="0.03" />
            <Stop offset="100%" stopColor={OB.glowAccent} stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Ellipse cx={SW * 0.4} cy={SW * 0.4} rx={SW * 0.4} ry={SW * 0.4} fill="url(#ctaglow1)" />
        <Ellipse cx={SW * 0.4} cy={SW * 0.4} rx={SW * 0.35} ry={SW * 0.35} fill="url(#ctaglow2)" />
      </Svg>

      <Animated.View style={logoStyle}>
        <Image
          source={require("../../assets/logo.png")}
          style={styles.ctaLogo}
          resizeMode="contain"
        />
      </Animated.View>

      <View style={styles.featurePillsRow}>
        {[
          { icon: "shield-checkmark-outline" as const, label: "Safe spots" },
          { icon: "cafe-outline" as const, label: "Study" },
          { icon: "wifi-outline" as const, label: "Wi-Fi" },
        ].map((f, i) => (
          <View key={i} style={[styles.featurePillSmall, i > 0 && { marginLeft: 8 }]}>
            <Ionicons name={f.icon} size={10} color={OB.textMuted} />
            <Text style={styles.featurePillSmallText}>{f.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

// ─── Main Component ─────────────────────────────────────────────────
export default function OnboardingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scrollX = useSharedValue(0);
  const lastPage = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollViewRef = useRef<Animated.ScrollView>(null);

  const triggerHaptic = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
      const currentPage = Math.round(event.contentOffset.x / SW);
      if (currentPage !== lastPage.current) {
        lastPage.current = currentPage;
        runOnJS(triggerHaptic)();
      }
    },
  });

  // Auto-advance timer
  const resetAutoAdvance = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      const current = Math.round(scrollX.value / SW);
      if (current < PAGE_COUNT - 1) {
        scrollViewRef.current?.scrollTo({ x: (current + 1) * SW, animated: true });
        // Re-arm after settle
        setTimeout(() => resetAutoAdvance(), 600);
      }
    }, 5000);
  }, []);

  useEffect(() => {
    resetAutoAdvance();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleFinish = async () => {
    await markOnboardingSeen();
    router.push("/(auth)/login");
  };

  const goToPage = (page: number) => {
    resetAutoAdvance();
    scrollViewRef.current?.scrollTo({ x: page * SW, animated: true });
  };

  // ─── Top Bar Animated Styles ────────────────────────────────────
  const backStyle = useAnimatedStyle(() => {
    const progress = interpolate(scrollX.value, [0, SW], [0, 1], Extrapolation.CLAMP);
    return {
      width: interpolate(progress, [0, 1], [0, 36]),
      marginRight: interpolate(progress, [0, 1], [0, 12]),
      opacity: progress,
    };
  });

  const skipStyle = useAnimatedStyle(() => {
    const op = interpolate(
      scrollX.value,
      [(PAGE_COUNT - 2) * SW, (PAGE_COUNT - 1) * SW],
      [1, 0],
      Extrapolation.CLAMP
    );
    return { opacity: op };
  });

  // ─── Render visuals per page ────────────────────────────────────
  const renderVisual = (pageIdx: number) => {
    switch (PAGES[pageIdx].visual) {
      case "discover":
        return (
          <IconConstellation
            centerIcon="bookmark-outline"
            centerColor={OB.glowPrimary}
            satellites={[
              { icon: "cafe-outline", color: OB.glowAccent, top: 10, left: 20, delay: 0 },
              { icon: "wifi-outline", color: OB.glowPrimary, top: 15, left: SW * 0.7 - 70, delay: 300 },
              { icon: "moon-outline", color: OB.glowSecondary, top: SH * 0.25 - 55, left: 35, delay: 500 },
              { icon: "star-outline", color: OB.glowAccent, top: SH * 0.25 - 50, left: SW * 0.7 - 65, delay: 700 },
            ]}
          />
        );
      case "safety":
        return (
          <IconConstellation
            centerIcon="shield-checkmark-outline"
            centerColor={OB.glowSecondary}
            satellites={[
              { icon: "flashlight-outline", color: OB.glowAccent, top: 5, left: 30, delay: 200 },
              { icon: "eye-outline", color: OB.glowPrimary, top: 20, left: SW * 0.7 - 65, delay: 0 },
              { icon: "lock-closed-outline", color: OB.glowSecondary, top: SH * 0.25 - 55, left: 25, delay: 600 },
              { icon: "heart-outline", color: OB.glowAccent, top: SH * 0.25 - 45, left: SW * 0.7 - 60, delay: 400 },
            ]}
          />
        );
      case "organize":
        return <StepCards />;
      case "cta":
        return <CTAVisual />;
      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: OB.bg }]}>
      <GlowBackground />

      {/* ─── Top Bar ──────────────────────────────────────── */}
      <View style={[styles.topBar, { top: insets.top + 8 }]}>
        <Animated.View style={[styles.backButton, backStyle]}>
          <TouchableOpacity
            onPress={() => {
              const cur = Math.round(scrollX.value / SW);
              if (cur > 0) goToPage(cur - 1);
            }}
            style={styles.backButtonInner}
          >
            <Ionicons name="chevron-back" size={14} color={OB.text} />
          </TouchableOpacity>
        </Animated.View>

        {/* Progress Bar */}
        <View style={styles.progressBar}>
          {PAGES.map((_, i) => (
            <ProgressSegment key={i} index={i} scrollX={scrollX} />
          ))}
        </View>

        <Animated.View style={skipStyle}>
          <TouchableOpacity
            onPress={() => goToPage(PAGE_COUNT - 1)}
            style={{ marginLeft: 12 }}
          >
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* ─── Pages ────────────────────────────────────────── */}
      <Animated.ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={scrollHandler}
        onScrollBeginDrag={() => resetAutoAdvance()}
      >
        {PAGES.map((page, i) => (
          <View key={i} style={styles.page}>
            <PageContent index={i} scrollX={scrollX}>
              <GlassPill icon={page.tagIcon} text={page.tagText} />
              <View style={styles.visualWrapper}>{renderVisual(i)}</View>
            </PageContent>
          </View>
        ))}
      </Animated.ScrollView>

      {/* ─── Swipe Hint (page 0 only) ────────────────────── */}
      <SwipeHint scrollX={scrollX} />

      {/* ─── Bottom Fixed Area ────────────────────────────── */}
      <View style={[styles.bottomArea, { paddingBottom: Math.max(insets.bottom, 20) + 40 }]}>
        {/* Crossfading text */}
        <View style={styles.textContainer}>
          {PAGES.map((page, i) => (
            <CrossfadeText key={i} index={i} scrollX={scrollX} headline={page.headline} body={page.body} />
          ))}
        </View>

        {/* Social proof strip (not on last) */}
        <View style={styles.proofContainer}>
          {PAGE_PROOF.map((stats, i) => (
            <ProofStrip key={i} index={i} scrollX={scrollX} stats={stats} />
          ))}
        </View>

        {/* Buttons */}
        <View style={styles.buttonsContainer}>
          <ContinueButton scrollX={scrollX} onPress={() => {
            const cur = Math.round(scrollX.value / SW);
            if (cur < PAGE_COUNT - 1) goToPage(cur + 1);
          }} />
          <CTAButtons scrollX={scrollX} onGetStarted={handleFinish} onSignUp={() => {
            handleFinish();
          }} />
        </View>
      </View>
    </View>
  );
}

// ─── Progress Segment ───────────────────────────────────────────────
function ProgressSegment({
  index,
  scrollX,
}: {
  index: number;
  scrollX: SharedValue<number>;
}) {
  const fillStyle = useAnimatedStyle(() => {
    const pageProgress = scrollX.value / SW;
    let fillPercent = 0;
    if (pageProgress >= index + 1) {
      fillPercent = 1;
    } else if (pageProgress > index) {
      fillPercent = pageProgress - index;
    }
    return { width: `${fillPercent * 100}%` as any };
  });

  const opacityStyle = useAnimatedStyle(() => {
    const pageProgress = scrollX.value / SW;
    let op = 0.4;
    if (pageProgress >= index + 1) op = 1;
    else if (pageProgress > index) op = interpolate(pageProgress - index, [0, 1], [0.4, 1]);
    return { opacity: op };
  });

  return (
    <View style={[styles.progressSegment, index > 0 && { marginLeft: 4 }]}>
      <Animated.View style={[styles.progressFill, fillStyle, opacityStyle]} />
    </View>
  );
}

// ─── Page Content (animated entry) ──────────────────────────────────
function PageContent({
  index,
  scrollX,
  children,
}: {
  index: number;
  scrollX: SharedValue<number>;
  children: React.ReactNode;
}) {
  const animStyle = useAnimatedStyle(() => {
    const input = [(index - 1) * SW, index * SW, (index + 1) * SW];
    return {
      opacity: interpolate(scrollX.value, input, [0, 1, 0], Extrapolation.CLAMP),
      transform: [
        {
          translateY: interpolate(scrollX.value, input, [25, 0, -25], Extrapolation.CLAMP),
        },
      ],
    };
  });

  const visualStyle = useAnimatedStyle(() => {
    const input = [(index - 1) * SW, index * SW, (index + 1) * SW];
    return {
      opacity: interpolate(scrollX.value, input, [0, 1, 0], Extrapolation.CLAMP),
      transform: [
        { scale: interpolate(scrollX.value, input, [0.85, 1, 0.85], Extrapolation.CLAMP) },
        { translateX: interpolate(scrollX.value, input, [40, 0, -40], Extrapolation.CLAMP) },
      ],
    };
  });

  return (
    <View style={styles.pageContent}>
      <Animated.View style={[{ alignItems: "center", marginBottom: 40 }, animStyle]}>
        {React.Children.toArray(children)[0]}
      </Animated.View>
      <Animated.View style={[styles.visualWrapper, visualStyle]}>
        {React.Children.toArray(children)[1]}
      </Animated.View>
    </View>
  );
}

// ─── Crossfade Text ─────────────────────────────────────────────────
function CrossfadeText({
  index,
  scrollX,
  headline,
  body,
}: {
  index: number;
  scrollX: SharedValue<number>;
  headline: string;
  body: string;
}) {
  const animStyle = useAnimatedStyle(() => {
    const input = [(index - 1) * SW, index * SW, (index + 1) * SW];
    return {
      opacity: interpolate(scrollX.value, input, [0, 1, 0], Extrapolation.CLAMP),
      transform: [
        {
          translateY: interpolate(scrollX.value, input, [12, 0, -12], Extrapolation.CLAMP),
        },
      ],
    };
  });

  return (
    <Animated.View style={[styles.crossfadeTextBlock, animStyle]}>
      <Text style={styles.headline}>{headline}</Text>
      <Text style={styles.bodyText}>{body}</Text>
    </Animated.View>
  );
}

// ─── Social Proof Strip ─────────────────────────────────────────────
function ProofStrip({
  index,
  scrollX,
  stats,
}: {
  index: number;
  scrollX: SharedValue<number>;
  stats: { value: string; label: string }[];
}) {
  const animStyle = useAnimatedStyle(() => {
    const input = [(index - 1) * SW, index * SW, (index + 1) * SW];
    const lastFade = interpolate(
      scrollX.value,
      [(PAGE_COUNT - 2) * SW, (PAGE_COUNT - 1) * SW],
      [1, 0],
      Extrapolation.CLAMP
    );
    return {
      opacity:
        interpolate(scrollX.value, input, [0, 1, 0], Extrapolation.CLAMP) * lastFade,
    };
  });

  return (
    <Animated.View style={[styles.proofStrip, animStyle]}>
      {stats.map((s, i) => (
        <View key={i} style={[styles.proofItem, i > 0 && { marginLeft: 20 }]}>
          <Text style={styles.proofValue}>{s.value}</Text>
          <Text style={styles.proofLabel}>{s.label}</Text>
        </View>
      ))}
    </Animated.View>
  );
}

// ─── Continue Button (pages 0-2) ────────────────────────────────────
function ContinueButton({
  scrollX,
  onPress,
}: {
  scrollX: SharedValue<number>;
  onPress: () => void;
}) {
  const animStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollX.value,
      [(PAGE_COUNT - 2) * SW, (PAGE_COUNT - 1) * SW],
      [1, 0],
      Extrapolation.CLAMP
    ),
  }));

  return (
    <Animated.View style={[styles.continueButtonContainer, animStyle]}>
      <TouchableOpacity style={styles.continueButton} onPress={onPress} activeOpacity={0.7}>
        <Text style={styles.continueText}>Continue</Text>
        <Ionicons name="arrow-forward" size={16} color={OB.text} style={{ marginLeft: 8 }} />
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── CTA Buttons (last page) ────────────────────────────────────────
function CTAButtons({
  scrollX,
  onGetStarted,
  onSignUp,
}: {
  scrollX: SharedValue<number>;
  onGetStarted: () => void;
  onSignUp: () => void;
}) {
  const animStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollX.value,
      [(PAGE_COUNT - 2) * SW, (PAGE_COUNT - 1) * SW],
      [0, 1],
      Extrapolation.CLAMP
    ),
    transform: [
      {
        translateY: interpolate(
          scrollX.value,
          [(PAGE_COUNT - 2) * SW, (PAGE_COUNT - 1) * SW],
          [30, 0],
          Extrapolation.CLAMP
        ),
      },
    ],
  }));

  return (
    <Animated.View style={[styles.ctaContainer, animStyle]}>
      <TouchableOpacity
        style={styles.ctaPrimaryButton}
        onPress={onGetStarted}
        activeOpacity={0.8}
      >
        <Text style={styles.ctaPrimaryText}>Get Started</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── Swipe Hint ─────────────────────────────────────────────────────
function SwipeHint({ scrollX }: { scrollX: SharedValue<number> }) {
  const bounce = useSharedValue(0);

  useEffect(() => {
    bounce.value = withRepeat(
      withSequence(
        withTiming(10, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 800, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, []);

  const hintStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollX.value, [0, SW * 0.3], [1, 0], Extrapolation.CLAMP),
    transform: [{ translateX: bounce.value }],
  }));

  return (
    <Animated.View style={[styles.swipeHint, { top: SH * 0.52 }]} >
      <Animated.View style={[{ flexDirection: "row" }, hintStyle]}>
        <Ionicons name="chevron-forward" size={12} color={OB.textDim} />
        <Ionicons name="chevron-forward" size={12} color={OB.textMuted} />
      </Animated.View>
    </Animated.View>
  );
}

// ─── Styles ─────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // Top bar
  topBar: {
    position: "absolute",
    left: 20,
    right: 20,
    zIndex: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: OB.borderHover,
    backgroundColor: OB.surfaceRaised,
    overflow: "hidden",
  },
  backButtonInner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  progressBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  progressSegment: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: OB.textFaint,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
    backgroundColor: OB.glowAccent,
  },
  skipText: {
    fontSize: 14,
    fontWeight: "500",
    color: OB.textMuted,
  },

  // Glass pill
  glassPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: OB.borderHover,
    backgroundColor: OB.surfaceRaised,
  },
  glassPillText: {
    fontSize: 12,
    fontWeight: "500",
    color: OB.textMuted,
    marginLeft: 8,
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },

  // Pages
  page: {
    width: SW,
    height: SH,
    paddingHorizontal: 28,
  },
  pageContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: SH * 0.08,
    paddingBottom: SH * 0.42,
  },
  visualWrapper: {
    width: SW * 0.7,
    height: SH * 0.25,
    justifyContent: "center",
    alignItems: "center",
  },

  // Icon constellation
  constellationContainer: {
    width: SW * 0.7,
    height: SH * 0.25,
    justifyContent: "center",
    alignItems: "center",
  },
  centerIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 1,
    borderColor: OB.borderHover,
    backgroundColor: OB.surfaceRaised,
    justifyContent: "center",
    alignItems: "center",
  },
  floatingIcon: {
    position: "absolute",
    padding: 11,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: OB.border,
    backgroundColor: OB.surfaceRaised,
  },

  // Step cards
  stepCardsContainer: {
    alignItems: "center",
  },
  stepCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: OB.border,
    backgroundColor: OB.cardBg,
    width: SW * 0.55,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  stepIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  stepNum: {
    fontSize: 18,
    fontWeight: "700",
    color: OB.textDim,
  },
  stepLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: OB.textMuted,
  },

  // CTA visual
  ctaVisualContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  ctaGlow: {
    position: "absolute",
  },
  ctaLogo: {
    width: 100,
    height: 100,
  },
  featurePillsRow: {
    flexDirection: "row",
    marginTop: 24,
  },
  featurePillSmall: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: OB.border,
    backgroundColor: OB.surfaceRaised,
  },
  featurePillSmallText: {
    fontSize: 11,
    fontWeight: "500",
    color: OB.textMuted,
    marginLeft: 6,
  },

  // Bottom area
  bottomArea: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
  },

  // Crossfading text
  textContainer: {
    width: "100%",
    height: 130,
    position: "relative",
    marginBottom: 8,
  },
  crossfadeTextBlock: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  headline: {
    fontSize: 28,
    fontWeight: "700",
    color: OB.text,
    lineHeight: 36,
    textAlign: "center",
    marginBottom: 8,
  },
  bodyText: {
    fontSize: 15,
    fontWeight: "400",
    color: OB.textMuted,
    lineHeight: 23,
    textAlign: "center",
  },

  // Proof strip
  proofContainer: {
    width: "100%",
    height: 70,
    marginBottom: 8,
    position: "relative",
  },
  proofStrip: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: OB.border,
    backgroundColor: OB.surfaceRaised,
  },
  proofItem: {
    alignItems: "center",
  },
  proofValue: {
    fontSize: 20,
    fontWeight: "700",
    color: OB.text,
    lineHeight: 26,
  },
  proofLabel: {
    fontSize: 11,
    fontWeight: "500",
    color: OB.textDim,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginTop: 2,
  },

  // Buttons
  buttonsContainer: {
    width: "100%",
    height: 52,
    marginTop: 20,
    position: "relative",
  },
  continueButtonContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  continueButton: {
    height: 52,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: OB.borderHover,
    backgroundColor: OB.surfaceRaised,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  continueText: {
    fontSize: 16,
    fontWeight: "600",
    color: OB.text,
  },
  ctaContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  ctaPrimaryButton: {
    height: 56,
    borderRadius: 999,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  ctaPrimaryText: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.white,
  },

  // Swipe hint
  swipeHint: {
    position: "absolute",
    right: 24,
    zIndex: 15,
  },
});
