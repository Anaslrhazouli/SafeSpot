import { z } from "zod";

// ── Database row types ──

export interface Spot {
  id: string;
  user_id: string;
  title: string;
  category: string;
  description: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  rating: number;
  is_favorite: boolean;
  is_safe_at_night: boolean;
  created_at: string;
  updated_at: string;
}

export interface SpotTag {
  id: string;
  spot_id: string;
  label: string;
}

export interface SpotPhoto {
  id: string;
  spot_id: string;
  image_url: string;
  created_at: string;
}

/** Spot with related data joined */
export interface SpotWithRelations extends Spot {
  tags: SpotTag[];
  photos: SpotPhoto[];
}

// ── Zod validation schemas ──

export const createSpotSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  category: z.string().min(1, "Category is required"),
  description: z.string().max(500).optional().default(""),
  address: z.string().max(200).optional().default(""),
  latitude: z.number().min(-90).max(90).optional().nullable(),
  longitude: z.number().min(-180).max(180).optional().nullable(),
  rating: z.number().int().min(0).max(5).default(0),
  is_favorite: z.boolean().default(false),
  is_safe_at_night: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  photo_uris: z.array(z.string()).default([]),
});

export type CreateSpotInput = z.infer<typeof createSpotSchema>;

export const updateSpotSchema = createSpotSchema.partial().extend({
  id: z.string().uuid(),
});

export type UpdateSpotInput = z.infer<typeof updateSpotSchema>;
