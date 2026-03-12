export const colors = {
  primary: "#1F3A5F",
  primaryDark: "#152A45",
  secondary: "#7FA38A",
  accent: "#E9846E",
  background: "#F7F8F5",
  surface: "#FFFFFF",
  surfaceAlt: "#F1F3EE",
  border: "#D9DED6",
  textPrimary: "#182028",
  textSecondary: "#5E6873",
  textTertiary: "#8A939C",
  success: "#4C9A6A",
  warning: "#D9A441",
  error: "#D65C5C",
  info: "#5C8FD6",
  white: "#FFFFFF",
  black: "#000000",
  transparent: "transparent",
} as const;

export const typography = {
  display: { fontSize: 32, fontWeight: "700" as const, lineHeight: 40 },
  h1: { fontSize: 24, fontWeight: "700" as const, lineHeight: 32 },
  h2: { fontSize: 20, fontWeight: "600" as const, lineHeight: 28 },
  h3: { fontSize: 18, fontWeight: "600" as const, lineHeight: 26 },
  body: { fontSize: 16, fontWeight: "400" as const, lineHeight: 24 },
  caption: { fontSize: 14, fontWeight: "400" as const, lineHeight: 20 },
  small: { fontSize: 12, fontWeight: "500" as const, lineHeight: 16 },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  "2xl": 32,
  "3xl": 40,
} as const;

export const radius = {
  sm: 10,
  md: 16,
  lg: 22,
  xl: 28,
  pill: 999,
} as const;

export const shadows = {
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
} as const;

export const theme = { colors, typography, spacing, radius, shadows } as const;
export type Theme = typeof theme;
