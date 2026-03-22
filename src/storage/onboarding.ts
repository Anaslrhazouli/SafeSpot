import AsyncStorage from "@react-native-async-storage/async-storage";

const ONBOARDING_KEY = "safespot_onboarding_v2";

export async function hasSeenOnboarding(): Promise<boolean> {
  try {
    const value = await AsyncStorage.getItem(ONBOARDING_KEY);
    return value === "true";
  } catch {
    return false;
  }
}

export async function markOnboardingSeen(): Promise<void> {
  try {
    await AsyncStorage.setItem(ONBOARDING_KEY, "true");
  } catch {
    // Best effort
  }
}
