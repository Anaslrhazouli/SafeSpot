import { supabase } from "@/lib/supabase";
import type { SpotPhoto } from "@/types/spot";

export async function getPhotosForSpot(spotId: string): Promise<SpotPhoto[]> {
  const { data, error } = await supabase
    .from("spot_photos")
    .select("*")
    .eq("spot_id", spotId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function addPhotoRecord(
  spotId: string,
  imageUrl: string
): Promise<SpotPhoto> {
  const { data, error } = await supabase
    .from("spot_photos")
    .insert({ spot_id: spotId, image_url: imageUrl })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deletePhotoRecord(photoId: string): Promise<void> {
  const { error } = await supabase
    .from("spot_photos")
    .delete()
    .eq("id", photoId);

  if (error) throw error;
}

/** Fetch the first photo for each spot in a list of IDs. Returns a map spotId → imageUrl */
export async function getFirstPhotosForSpots(
  spotIds: string[]
): Promise<Record<string, string>> {
  if (spotIds.length === 0) return {};

  const { data, error } = await supabase
    .from("spot_photos")
    .select("spot_id, image_url")
    .in("spot_id", spotIds)
    .order("created_at", { ascending: true });

  if (error) throw error;

  const map: Record<string, string> = {};
  for (const row of data ?? []) {
    if (!map[row.spot_id]) {
      map[row.spot_id] = row.image_url;
    }
  }
  return map;
}
