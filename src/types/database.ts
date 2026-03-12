import type { Spot, SpotTag, SpotPhoto } from "./spot";
import type { Profile } from "./profile";

/** Supabase table type map for type-safe queries */
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, "created_at">;
        Update: Partial<Omit<Profile, "id" | "created_at">>;
      };
      spots: {
        Row: Spot;
        Insert: Omit<Spot, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Spot, "id" | "user_id" | "created_at">>;
      };
      spot_tags: {
        Row: SpotTag;
        Insert: Omit<SpotTag, "id">;
        Update: Partial<Omit<SpotTag, "id">>;
      };
      spot_photos: {
        Row: SpotPhoto;
        Insert: Omit<SpotPhoto, "id" | "created_at">;
        Update: Partial<Omit<SpotPhoto, "id" | "created_at">>;
      };
    };
  };
}
