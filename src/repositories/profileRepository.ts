import { supabase } from "@/lib/supabase";
import type { Profile } from "@/types/profile";

export async function upsertProfile(
  userId: string,
  email: string,
  displayName?: string
): Promise<void> {
  const { error } = await supabase
    .from("profiles")
    .upsert(
      { id: userId, email, display_name: displayName ?? null },
      { onConflict: "id" }
    );
  if (error) throw error;
}

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error && error.code !== "PGRST116") throw error;
  return data;
}

export async function updateProfile(
  userId: string,
  updates: { display_name?: string }
): Promise<Profile> {
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
