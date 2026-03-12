import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Spot } from "@/types/spot";

const SPOTS_CACHE_KEY = "safespot_spots_cache";

export async function saveSpotsToCache(spots: Spot[]): Promise<void> {
  try {
    await AsyncStorage.setItem(SPOTS_CACHE_KEY, JSON.stringify(spots));
  } catch {
    // Fail silently — cache is best effort
  }
}

export async function loadSpotsFromCache(): Promise<Spot[]> {
  try {
    const raw = await AsyncStorage.getItem(SPOTS_CACHE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Spot[];
  } catch {
    return [];
  }
}

export async function clearSpotsCache(): Promise<void> {
  try {
    await AsyncStorage.removeItem(SPOTS_CACHE_KEY);
  } catch {
    // Fail silently
  }
}
