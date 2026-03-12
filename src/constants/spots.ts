export const CATEGORIES = [
  "Study",
  "Safe",
  "Food",
  "Health",
  "Parking",
  "Quiet",
  "Photo",
  "Work",
  "Coffee",
  "Shopping",
  "Nature",
  "Nightlife",
] as const;

export type SpotCategory = (typeof CATEGORIES)[number];

export const TAGS = [
  "wifi",
  "outlets",
  "calm",
  "open late",
  "cheap",
  "accessible",
  "bright",
  "safe",
  "cozy",
  "quiet",
  "pet friendly",
  "parking",
  "outdoor seating",
  "good coffee",
] as const;

export type SpotTagLabel = (typeof TAGS)[number];

/** Map categories to display colors for chips and map markers */
export const CATEGORY_COLORS: Record<string, string> = {
  Study: "#5C8FD6",
  Safe: "#4C9A6A",
  Food: "#E9846E",
  Health: "#D65C5C",
  Parking: "#D9A441",
  Quiet: "#7FA38A",
  Photo: "#9B6FD6",
  Work: "#1F3A5F",
  Coffee: "#A6785D",
  Shopping: "#C47BD6",
  Nature: "#5BAE7C",
  Nightlife: "#6C5CE7",
};

/** Map categories to Ionicons icon names */
export const CATEGORY_ICONS: Record<string, string> = {
  Study: "book-outline",
  Safe: "shield-checkmark-outline",
  Food: "restaurant-outline",
  Health: "medkit-outline",
  Parking: "car-outline",
  Quiet: "leaf-outline",
  Photo: "camera-outline",
  Work: "briefcase-outline",
  Coffee: "cafe-outline",
  Shopping: "cart-outline",
  Nature: "flower-outline",
  Nightlife: "moon-outline",
};

/** Map tags to Ionicons icon names */
export const TAG_ICONS: Record<string, string> = {
  wifi: "wifi-outline",
  outlets: "flash-outline",
  calm: "leaf-outline",
  "open late": "moon-outline",
  cheap: "pricetag-outline",
  accessible: "accessibility-outline",
  bright: "sunny-outline",
  safe: "shield-checkmark-outline",
  cozy: "flame-outline",
  quiet: "volume-mute-outline",
  "pet friendly": "paw-outline",
  parking: "car-outline",
  "outdoor seating": "umbrella-outline",
  "good coffee": "cafe-outline",
};
