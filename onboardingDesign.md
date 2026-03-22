# Premium Dark Onboarding — Full Design Specification

> A reusable prompt to recreate this onboarding design in any application. Hand this to any AI or developer for a faithful recreation.

---

## 1. OVERALL LAYOUT & COLOR SYSTEM

### Background
- Near-black base: `#08080A`
- The entire screen is full-bleed with NO safe area padding on the background itself
- StatusBar: `barStyle="light-content"`, translucent, transparent background

### Color Tokens (define once, reference everywhere)

| Token | Value | Usage |
|-------|-------|-------|
| `bg` | `#08080A` | Near-black base background |
| `text` | `#FFFFFF` | Primary text — pure white |
| `textMuted` | `rgba(255,255,255,0.45)` | Secondary text, labels, body copy |
| `textDim` | `rgba(255,255,255,0.30)` | Tertiary text, step numbers |
| `textFaint` | `rgba(255,255,255,0.15)` | Barely visible, unfilled progress bars |
| `border` | `rgba(255,255,255,0.06)` | Subtle borders on cards/glass elements |
| `borderHover` | `rgba(255,255,255,0.12)` | Brighter borders on interactive elements |
| `surface` | `rgba(255,255,255,0.01)` | Barely-there surface |
| `surfaceRaised` | `rgba(255,255,255,0.04)` | Glass card backgrounds, buttons, floating icons |
| `cardBg` | `rgba(10,10,14,0.80)` | Opaque-ish card background for stacked cards |
| `glowPurple` | `#29235C` | Brand purple — used for ambient glow orbs |
| `glowRed` | `#FB350E` | Brand accent red — CTAs, progress, active icons |

### Typography

| Role | Font | Size | Color | Extra |
|------|------|------|-------|-------|
| Headlines | Poppins-SemiBold | 30px | `text` | lineHeight 38, center |
| Body | Satoshi-Medium | 15px | `textMuted` | lineHeight 23, center |
| Labels/Tags | Satoshi-Medium | 12px | `textMuted` | uppercase, letterSpacing 1.5 |
| Stats values | Poppins-Bold | 20px | `text` | lineHeight 26 |
| Stats labels | Satoshi-Medium | 11px | `textDim` | uppercase, letterSpacing 1 |
| Buttons | Satoshi-Bold | 16px | `text` or `#FFFFFF` | — |
| Small text | Satoshi-Medium | 14px | `textMuted` | — |

---

## 2. GLOW BACKGROUND (always visible, behind everything)

A full-screen absolute-fill layer with multiple SVG radial gradient ellipses ("glow orbs"). This creates the living, breathing atmosphere.

### Orb Placement (4 orbs)

| # | Position (cx, cy) | Size (rx, ry) | Color | Base Opacity | Breath Duration |
|---|-------------------|---------------|-------|--------------|-----------------|
| 1 | 20%, 15% | 45%, 35% | glowPurple | 0.4 | 6000ms |
| 2 | 85%, 10% | 35%, 30% | glowRed | 0.12 | 5000ms |
| 3 | 50%, 45% | 30%, 25% | glowPurple | 0.2 | 7000ms |
| 4 | 75%, 80% | 25%, 20% | glowRed | 0.1 | 4500ms |

### Breathing Animation

Each orb pulses its opacity between `baseOpacity * 0.75` and `baseOpacity * 1.25` using `withRepeat(withSequence(withTiming(...), withTiming(...)))` with staggered durations so they **never sync up** — creating organic, living movement.

### SVG Structure (per orb)

```xml
<RadialGradient cx="50%" cy="50%" rx="50%" ry="50%">
  <Stop offset="0%" stopColor={color} stopOpacity="1" />
  <Stop offset="100%" stopColor={color} stopOpacity="0" />
</RadialGradient>
<Ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="url(#gradient)" />
```

---

## 3. TOP BAR (fixed, absolute positioned)

Positioned at `top: safeAreaInsets.top + 8`, left/right 20px, zIndex 20. Three elements in a row:

### Back Arrow (animated width collapse)

- **Page 0**: width=0, marginRight=0, opacity=0 — completely invisible and takes zero space
- **Page 0→1 transition**: animates to width=36, marginRight=12, opacity=1
- Circle button: 36×36, borderRadius 18, border 1px `borderHover`, bg `surfaceRaised`
- Contains a chevron-left icon, 14px, color `text`
- On press: scroll to previous page

### Segmented Progress Bar (fills remaining flex space)

- `flex: 1` row of N segments (one per page)
- Each segment: **4px tall**, borderRadius 2, bg `textFaint` (unfilled)
- Fill behavior:
  - **Past pages**: fully filled, opacity 1, bg `glowRed`
  - **Current page**: partially filled based on scroll position, opacity 0.4→1, bg `glowRed`
  - **Future pages**: unfilled, bg `textFaint`
- Segments have **4px marginLeft** between them (except first)

### Skip Button (right side)

- Text "Passer" (or "Skip"), Satoshi-Medium 14px, color `textMuted`
- marginLeft 12
- Fades out on last page (opacity interpolated from 1→0)
- On press: jump to last page

---

## 4. PAGE STRUCTURE (horizontal ScrollView)

A full-screen `Animated.ScrollView`: horizontal, pagingEnabled, bounces=false, scrollEventThrottle=16. Each page is exactly `screenWidth × screenHeight`.

### Per-Page Layout

```
paddingHorizontal: 28
paddingTop: screenHeight * 0.08
paddingBottom: screenHeight * 0.42  // reserves space for fixed bottom area
```

**pageTopContent** (flex 1, centered vertically and horizontally):
1. **Tag** (GlassPill) — at top of centered content, marginBottom 40
2. **Visual** — fixed height container (screenHeight × 0.25), centered

### Page Animations (scroll-driven, per page)

Each page's content animates based on its position relative to the scroll offset:

| Element | Property | Off-left | Active | Off-right |
|---------|----------|----------|--------|-----------|
| Content (tag) | opacity | 0 | 1 | 0 |
| Content (tag) | translateY | 25 | 0 | -25 |
| Visual | scale | 0.85 | 1 | 0.85 |
| Visual | translateX | 40 | 0 | -40 |
| Visual | opacity | 0 | 1 | 0 |

Input range: `[(i-1)*screenWidth, i*screenWidth, (i+1)*screenWidth]`

---

## 5. GLASS PILL (tag component)

A frosted-glass pill shape used for page category labels:

```
flexDirection: row
alignItems: center
paddingHorizontal: 16
paddingVertical: 8
borderRadius: 999 (full pill)
borderWidth: 1
borderColor: borderHover
backgroundColor: surfaceRaised
```

- **Icon**: 12px, color `glowRed`
- **Text**: Satoshi-Medium 12px, color `textMuted`, marginLeft 8, uppercase, letterSpacing 1.5

---

## 6. PAGE VISUALS (5 types)

### 6A. Icon Constellation (Discover / Studio pages)

A central pulsing icon surrounded by 4 floating satellite icons.

**Center Pulse Icon:**
- 72×72 circle, borderRadius 36, border 1px `borderHover`, bg `surfaceRaised`
- Main icon inside: 28px, white
- Behind the circle: a 140×140 SVG radial glow (color at 0.35 opacity → 0 at edges)
- **Pulse animation**: scale 1→1.06→1, duration 2500ms each way, infinite repeat

**Floating Icons (4 per constellation):**
- Each in a glass container: padding 11, borderRadius 14, border 1px `border`, bg `surfaceRaised`
- Positioned absolutely at specific top/left coordinates
- **Dual-axis float animation**:
  - **Y-axis**: moves through 3 keyframes (-amplitude, +amplitude×0.6, 0) on staggered durations (3600-4500ms)
  - **X-axis**: simple back-and-forth (-amplitude, +amplitude) on different durations (4600-5400ms)
  - **Stagger start**: delay parameter per icon (0ms, 300ms, 500ms, 700ms, 1000ms)
  - Both use `Easing.inOut(Easing.ease)`
- **Amplitudes**: Y=10-15px, X=5-9px (natural, non-mechanical float)

### 6B. Step Cards (Booking page)

Three vertically stacked glass cards representing a process:

**Step Card:**
```
flexDirection: row
alignItems: center
borderRadius: 16
borderWidth: 1
borderColor: border
backgroundColor: cardBg
width: screenWidth * 0.55
paddingHorizontal: 16
paddingVertical: 14
```

Each successive card has **marginTop 10** (slight cascade effect).

**Icon Container** (left side): 36×36, borderRadius 10, colored bg at 50-60% opacity:
- Step 1: purple `rgba(41,35,92,0.6)`
- Step 2: red `rgba(251,53,14,0.5)`
- Step 3: green `rgba(34,197,94,0.5)`
- Icon inside: 14px, white

**Text** (right side, marginLeft 14): step number (Satoshi-Bold 18px, `textDim`) + label (Satoshi-Medium 14px, `textMuted`)

### 6C. Feature List Card (Host page)

A single glass card with N feature rows:

**Card:**
```
width: screenWidth * 0.65
borderRadius: 20
borderWidth: 1
borderColor: border
backgroundColor: cardBg
paddingHorizontal: 20
paddingVertical: 18
```

**Feature Row:** flexDirection row, alignItems center, paddingVertical 10
- Icon container: 36×36, borderRadius 10, bg `{iconColor}20` (20% opacity of the icon's color)
- Icon: 14px, colored per feature (purple, red, green, blue)
- Text: Satoshi-Medium 14px, color `text`, marginLeft 14

### 6D. Logo + Feature Pills (CTA / final page)

- **Large SVG glow** behind logo (screenWidth × 1.6 diameter) with two overlapping radial gradients:
  - Purple glow: cx=25%, cy=30%, opacity 0.65→0.2→0
  - Red glow: cx=75%, cy=70%, opacity 0.4→0.1→0
- **Logo**: 80px, white, spring entrance animation (scale 0.85→1, damping 14, stiffness 80)
- **3 feature pills** in a row below (marginTop 24):
  - Each: paddingHorizontal 12, paddingVertical 6, borderRadius 999, border 1px `border`, bg `surfaceRaised`
  - Icon 10px `textMuted` + text Satoshi-Medium 11px `textMuted`, marginLeft 6
  - 8px marginLeft between pills (not on first)

---

## 7. BOTTOM FIXED AREA

Absolute positioned at `bottom: 0`, `left/right: 0`, `paddingHorizontal: 24`, `paddingBottom: 60`. Three stacked sections:

### 7A. Crossfading Text (all pages)

**Container**: width 100%, height 140, position relative, marginBottom 8.

All page texts overlap in the same space, each absolutely positioned at top 0. Each page's text block has scroll-driven animation:
- **opacity**: 0→1→0
- **translateY**: 12→0→-12

Content per text block: headline (Poppins-SemiBold 30px) + body (Satoshi-Medium 15px)

### 7B. Social Proof Strip (pages 0 through N-2, fades out on last page)

**Container**: width 100%, height 70, marginBottom 8, position relative.

Multiple strips overlap and crossfade (same scroll-driven opacity as text).

**Strip:**
```
position: absolute (fill)
flexDirection: row
justifyContent: center
paddingHorizontal: 20
paddingVertical: 14
borderRadius: 16
borderWidth: 1
borderColor: border
backgroundColor: surfaceRaised
```

3 stat items per strip, 20px marginLeft between them (except first):
- **Value**: Poppins-Bold 20px, `text`
- **Label**: Satoshi-Medium 11px, `textDim`, uppercase, letterSpacing 1, marginTop 2

**Each page has DIFFERENT stats** — they crossfade as you swipe.

### 7C. Buttons Area (overlap — Continue vs CTA)

**Container**: width 100%, height 52, marginTop 30, position relative.

Two overlapping button layouts that crossfade:

**Continue Button (pages 0 to N-2):**
- Absolute positioned, full width
- height 52, borderRadius 999, border 1px `borderHover`, bg `surfaceRaised`
- Text: Satoshi-Bold 16px, `text`, centered
- Fades to opacity 0 on last page
- On press: advance to next page

**CTA Area (last page only, fades IN):**
- Absolute positioned, full width
- **Primary CTA button**: height 56, borderRadius 999, bg `glowRed`
  - Shadow: iOS → `shadowColor: glowRed, offset: {0, 4}, opacity: 0.35, radius: 16` / Android → `elevation: 8`
  - Text: Satoshi-Bold 16px, white
- **Sign up row** (marginTop 12): secondary text (`textMuted`) + link text (`glowRed`, bold)
- **Guest link** (marginTop 8): underlined text, `textMuted`, paddingBottom respects safe area
- Slides up: translateY 30→0, opacity 0→1

---

## 8. SWIPE HINT (first page only)

Positioned absolute at `right: 24`, `top: screenHeight * 0.52`, zIndex 15.

Two chevron-right icons (12px) side by side — first at `textDim` opacity, second at `textMuted` opacity.

**Animation**: Bounces horizontally 0→10px→0 every 1600ms (800ms each way), `Easing.inOut(Easing.ease)`, infinite repeat.

**Fades out** as user begins scrolling (opacity 1→0 over first 30% of screen width).

---

## 9. AUTO-ADVANCE

- If the user doesn't interact for **5 seconds**, automatically advance to the next page
- After auto-advancing, wait for the page to settle (**600ms**), then restart the timer
- **Stop** auto-advance when reaching the last page
- **Reset** the timer on any user interaction (drag begin, button press)

---

## 10. HAPTIC FEEDBACK

- Trigger `Haptics.impactAsync(ImpactFeedbackStyle.Light)` on every page change
- Detect page changes by polling `scrollX.value / screenWidth` every **100ms** and comparing to a ref tracking the last page index

---

## 11. KEY DESIGN PRINCIPLES

1. **No solid backgrounds** — everything uses transparency. Cards at 0.04 opacity, borders at 0.06-0.12. The glow orbs bleed through everything.

2. **Breathing, not blinking** — all animations are slow (3-7 seconds), use ease-in-out, and have staggered timing so nothing feels synchronized or robotic.

3. **Scroll-driven transitions** — text, visuals, and stats all animate based on exact scroll position (not page index), creating fluid parallax-like transitions.

4. **Progressive disclosure** — back arrow grows from nothing, skip fades away, CTA slides up. UI adapts to where you are in the flow.

5. **Glass morphism without blur** — pill shapes with 1px borders at 0.06-0.12 white opacity on near-transparent backgrounds. No blur filter (performance). Depth comes from glow bleed-through.

6. **Dual accents** — purple (`#29235C`) for ambient glow/brand, red (`#FB350E`) for action/attention (CTAs, progress fill, active icons). Never compete — purple is background, red is foreground.

7. **Content hierarchy through opacity** — white (1.0) → muted (0.45) → dim (0.30) → faint (0.15). Four levels of text importance, no color changes needed.

8. **Safe area awareness** — top bar respects safe area insets, bottom CTA respects bottom insets, but the glow background bleeds edge to edge.

---

## 12. TECH STACK

| Dependency | Purpose |
|------------|---------|
| `react-native-reanimated` | All animations (shared values, scroll handler, interpolation, withRepeat/withSequence/withTiming/withSpring) |
| `react-native-svg` | Glow orbs (RadialGradient + Ellipse), center icon glow, logo page glow |
| `expo-haptics` | Light impact feedback on page change |
| `react-native-safe-area-context` | Safe area insets for top bar and bottom CTA |
| `expo-router` | Navigation on CTA buttons (login, register, guest browse) |

---

## 13. DATA STRUCTURE

```typescript
const PAGES = [
  {
    tagIcon: IconComponent,    // Icon for the glass pill
    tagText: 'Category',       // Uppercase label in glass pill
    headline: 'Two-line\nheadline',  // Poppins-SemiBold 30px
    body: 'Description text for this page.',  // Satoshi-Medium 15px
    visual: 'discover' | 'booking' | 'studio' | 'host' | 'cta',
  },
  // ... one per page
];

const PAGE_PROOF = [
  // Per page: array of 3 stat items
  [
    { value: '50+', label: 'Studios' },
    { value: '12+', label: 'Cities' },
    { value: '24/7', label: 'Available' },
  ],
  // ... one array per page (except last page)
];
```

---

## 14. RESPONSIVE SIZING REFERENCE

| Element | Size |
|---------|------|
| Visual container | screenWidth × 0.7 wide, screenHeight × 0.25 tall |
| Page top padding | screenHeight × 0.08 |
| Page bottom reserve | screenHeight × 0.42 |
| Step cards width | screenWidth × 0.55 |
| Host feature card width | screenWidth × 0.65 |
| CTA glow diameter | screenWidth × 1.6 |
| Swipe hint position | top = screenHeight × 0.52 |
| Center icon circle | 72×72 |
| Center icon glow | 140×140 |
| Floating icon padding | 11 all sides |
| Glass pill | 16h × 8v padding |
| Progress segment height | 4px |
| Back button | 36×36 |
