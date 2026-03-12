import { supabase } from "@/lib/supabase";
import type { SpotTag } from "@/types/spot";

export async function getTagsForSpot(spotId: string): Promise<SpotTag[]> {
  const { data, error } = await supabase
    .from("spot_tags")
    .select("*")
    .eq("spot_id", spotId);

  if (error) throw error;
  return data ?? [];
}

export async function setTagsForSpot(
  spotId: string,
  labels: string[]
): Promise<SpotTag[]> {
  // Delete existing tags then insert new ones
  const { error: deleteError } = await supabase
    .from("spot_tags")
    .delete()
    .eq("spot_id", spotId);

  if (deleteError) throw deleteError;

  if (labels.length === 0) return [];

  const rows = labels.map((label) => ({ spot_id: spotId, label }));
  const { data, error } = await supabase
    .from("spot_tags")
    .insert(rows)
    .select();

  if (error) throw error;
  return data ?? [];
}
