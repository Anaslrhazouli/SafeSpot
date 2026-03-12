const API_KEY = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY ?? "";

export interface PlacePrediction {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

export interface PlaceDetails {
  name: string;
  formatted_address: string;
  latitude: number;
  longitude: number;
}

/** Autocomplete search for places by text query */
export async function searchPlaces(query: string): Promise<PlacePrediction[]> {
  if (!query.trim() || !API_KEY) {
    if (!API_KEY) console.warn("[Places] Missing EXPO_PUBLIC_GOOGLE_PLACES_API_KEY");
    return [];
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query)}&key=${API_KEY}`;
    const res = await fetch(url);
    const json = await res.json();

    if (json.status === "REQUEST_DENIED") {
      console.warn("[Places] API key rejected:", json.error_message);
      return [];
    }
    if (json.status !== "OK" && json.status !== "ZERO_RESULTS") {
      console.warn("[Places] Autocomplete status:", json.status);
      return [];
    }
    return json.predictions ?? [];
  } catch (err) {
    console.warn("[Places] Autocomplete fetch error:", err);
    return [];
  }
}

/** Get place details (name, address, coordinates) by place_id */
export async function getPlaceDetails(placeId: string): Promise<PlaceDetails | null> {
  if (!placeId || !API_KEY) return null;

  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(placeId)}&fields=name,formatted_address,geometry&key=${API_KEY}`;
  const res = await fetch(url);
  const json = await res.json();

  if (json.status !== "OK" || !json.result) return null;

  const { result } = json;
  return {
    name: result.name ?? "",
    formatted_address: result.formatted_address ?? "",
    latitude: result.geometry.location.lat,
    longitude: result.geometry.location.lng,
  };
}

/** Reverse geocode: get address from coordinates */
export async function reverseGeocode(
  lat: number,
  lng: number
): Promise<PlacePrediction[]> {
  if (!API_KEY) return [];

  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${API_KEY}`;
  const res = await fetch(url);
  const json = await res.json();

  if (json.status !== "OK") return [];

  // Convert geocode results into PlacePrediction-compatible objects
  return (json.results ?? []).slice(0, 5).map((r: any) => ({
    place_id: r.place_id,
    description: r.formatted_address,
    structured_formatting: {
      main_text: r.address_components?.[0]?.long_name ?? "",
      secondary_text: r.formatted_address,
    },
  }));
}
