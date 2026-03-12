import * as Location from "expo-location";

export interface LocationCoords {
  latitude: number;
  longitude: number;
}

export async function requestPermission(): Promise<boolean> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  return status === "granted";
}

export async function getPermissionStatus(): Promise<string> {
  const { status } = await Location.getForegroundPermissionsAsync();
  return status;
}

export async function getCurrentPosition(): Promise<LocationCoords | null> {
  const granted = await requestPermission();
  if (!granted) return null;

  const location = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });

  return {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
  };
}

/** Reverse geocode coordinates into an address string using Expo Location (no API key needed) */
export async function reverseGeocodeAddress(
  latitude: number,
  longitude: number
): Promise<string | null> {
  try {
    const results = await Location.reverseGeocodeAsync({ latitude, longitude });
    if (results.length === 0) return null;
    const r = results[0];
    const parts = [
      r.streetNumber,
      r.street,
      r.city,
      r.region,
      r.postalCode,
      r.country,
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : null;
  } catch {
    return null;
  }
}

/** Haversine distance in km */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}
