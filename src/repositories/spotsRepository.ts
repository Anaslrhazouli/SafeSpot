import { supabase } from "@/lib/supabase";
import type { Spot } from "@/types/spot";

export async function listSpots(userId: string): Promise<Spot[]> {
  const { data, error } = await supabase
    .from("spots")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getSpotById(id: string): Promise<Spot | null> {
  const { data, error } = await supabase
    .from("spots")
    .select("*")
    .eq("id", id)
    .single();

  if (error && error.code !== "PGRST116") throw error;
  return data;
}

export interface CreateSpotPayload {
  user_id: string;
  title: string;
  category: string;
  description?: string;
  address?: string;
  latitude?: number | null;
  longitude?: number | null;
  rating?: number;
  is_favorite?: boolean;
  is_safe_at_night?: boolean;
}

export async function createSpot(payload: CreateSpotPayload): Promise<Spot> {
  const { data, error } = await supabase
    .from("spots")
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export interface UpdateSpotPayload {
  title?: string;
  category?: string;
  description?: string;
  address?: string;
  latitude?: number | null;
  longitude?: number | null;
  rating?: number;
  is_favorite?: boolean;
  is_safe_at_night?: boolean;
}

export async function updateSpot(
  id: string,
  payload: UpdateSpotPayload
): Promise<Spot> {
  const { data, error } = await supabase
    .from("spots")
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteSpot(id: string): Promise<void> {
  const { error } = await supabase.from("spots").delete().eq("id", id);
  if (error) throw error;
}
