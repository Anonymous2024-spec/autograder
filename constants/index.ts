import { Dimensions } from "react-native";

export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } =
  Dimensions.get("window");

// ── Color Palette ──────────────────────────────────────────
export const Colors = {
  // Primary — deep blue
  primary: "#1A56DB",
  primaryDark: "#1245B8",
  primaryDarker: "#0D3492",
  primaryLight: "#E8EFFD",
  primaryMid: "#2D6AE0",

  // Accent — teal
  accent: "#0EA5E9",
  accentLight: "#E0F5FF",

  // Gradient stops — used in headers and cards
  gradientStart: "#1A56DB",
  gradientEnd: "#0D3492",

  // Success
  success: "#10B981",
  successLight: "#D1FAE5",

  // Warning
  warning: "#F59E0B",
  warningLight: "#FEF3C7",

  // Error
  error: "#EF4444",
  errorLight: "#FEE2E2",

  // Backgrounds
  background: "#F1F5F9",
  backgroundDark: "#E2E8F0",
  surface: "#FFFFFF",
  surfaceSecondary: "#F8FAFC",

  // Text
  text: "#0F172A",
  textSecondary: "#334155",
  subtext: "#64748B",
  placeholder: "#94A3B8",
  textInverse: "#FFFFFF",

  // Border
  border: "#E2E8F0",
  borderDark: "#CBD5E1",

  // Card accents — for colored cards on dashboards
  cardBlue: "#1A56DB",
  cardTeal: "#0EA5E9",
  cardGreen: "#10B981",
  cardPurple: "#8B5CF6",
  cardOrange: "#F59E0B",
  cardRed: "#EF4444",

  // Misc
  white: "#FFFFFF",
  black: "#000000",
  overlay: "rgba(0,0,0,0.45)",
  transparent: "transparent",
};

// ── Typography ─────────────────────────────────────────────
export const FontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 24,
  xxxl: 30,
  display: 36,
};

export const FontWeight = {
  regular: "400" as const,
  medium: "500" as const,
  semibold: "600" as const,
  bold: "700" as const,
  extrabold: "800" as const,
};

// ── Spacing ────────────────────────────────────────────────
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// ── Border Radius ──────────────────────────────────────────
export const Radius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  full: 999,
};

// ── Shadows ────────────────────────────────────────────────
// Use these as spread props: {...Shadows.card}
export const Shadows = {
  sm: {
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  lg: {
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 8,
  },
  colored: {
    shadowColor: "#1A56DB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
};

// ── API ────────────────────────────────────────────────────
export const API_BASE_URL = "http://localhost:5000/api";
export const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";
export const GEMINI_API_KEY = "your_key_here";