import { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "SafeSpot Student",
  slug: "safespot-student",
  version: "1.0.0",
  orientation: "portrait",
  userInterfaceStyle: "light",
  scheme: "safespot",
  splash: {
    backgroundColor: "#F7F8F5",
    resizeMode: "contain",
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: false,
    bundleIdentifier: "com.safespot.student",
    config: {
      googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_IOS_KEY ?? "",
    },
    infoPlist: {
      NSLocationWhenInUseUsageDescription:
        "SafeSpot uses your location to help you save spots near you and calculate distances.",
      NSCameraUsageDescription:
        "SafeSpot uses your camera to take photos of your saved spots.",
      NSPhotoLibraryUsageDescription:
        "SafeSpot accesses your photo library to attach images to your spots.",
    },
  },
  android: {
    adaptiveIcon: {
      backgroundColor: "#F7F8F5",
    },
    package: "com.safespot.student",
    config: {
      googleMaps: {
        apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_ANDROID_KEY ?? "",
      },
    },
    permissions: [
      "ACCESS_FINE_LOCATION",
      "ACCESS_COARSE_LOCATION",
      "CAMERA",
      "READ_EXTERNAL_STORAGE",
    ],
  },
  web: {
    bundler: "metro",
  },
  plugins: [
    "expo-router",
    "expo-secure-store",
    [
      "expo-location",
      {
        locationWhenInUsePermission:
          "SafeSpot uses your location to help you save spots near you.",
      },
    ],
    [
      "expo-image-picker",
      {
        photosPermission:
          "SafeSpot accesses your photos to attach images to spots.",
        cameraPermission:
          "SafeSpot uses your camera to photograph your saved spots.",
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
});
