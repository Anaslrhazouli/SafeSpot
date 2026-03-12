import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import * as spotsRepo from "@/repositories/spotsRepository";
import * as tagsRepo from "@/repositories/tagsRepository";
import * as photosRepo from "@/repositories/photosRepository";
import * as photoService from "@/services/photoService";
import { saveSpotsToCache, loadSpotsFromCache } from "@/storage/cache";
import type { Spot, SpotTag, SpotPhoto } from "@/types/spot";

const SPOTS_KEY = "spots";
const SPOT_DETAIL_KEY = "spot-detail";
const SPOT_TAGS_KEY = "spot-tags";
const SPOT_PHOTOS_KEY = "spot-photos";
const SPOT_THUMBNAILS_KEY = "spot-thumbnails";

/** Extract the storage path from a Supabase public URL */
function extractStoragePath(publicUrl: string): string | null {
  const marker = "/object/public/spot-photos/";
  const idx = publicUrl.indexOf(marker);
  if (idx === -1) return null;
  return publicUrl.slice(idx + marker.length);
}

// ── List ──

export function useSpotsList() {
  const { user } = useAuth();
  const userId = user?.id;

  return useQuery<Spot[]>({
    queryKey: [SPOTS_KEY, userId],
    queryFn: async () => {
      if (!userId) return [];
      const spots = await spotsRepo.listSpots(userId);
      await saveSpotsToCache(spots);
      return spots;
    },
    enabled: !!userId,
    placeholderData: () => {
      // Return cached data while loading
      let cached: Spot[] = [];
      loadSpotsFromCache().then((c) => (cached = c));
      return cached;
    },
    retry: 2,
  });
}

// ── Detail ──

export function useSpotDetail(spotId: string | undefined) {
  return useQuery<Spot | null>({
    queryKey: [SPOT_DETAIL_KEY, spotId],
    queryFn: () => (spotId ? spotsRepo.getSpotById(spotId) : null),
    enabled: !!spotId,
  });
}

// ── Tags ──

export function useSpotTags(spotId: string | undefined) {
  return useQuery<SpotTag[]>({
    queryKey: [SPOT_TAGS_KEY, spotId],
    queryFn: () => (spotId ? tagsRepo.getTagsForSpot(spotId) : []),
    enabled: !!spotId,
  });
}

// ── Photos ──

export function useSpotPhotos(spotId: string | undefined) {
  return useQuery<SpotPhoto[]>({
    queryKey: [SPOT_PHOTOS_KEY, spotId],
    queryFn: () => (spotId ? photosRepo.getPhotosForSpot(spotId) : []),
    enabled: !!spotId,
  });
}

// ── Thumbnails (first photo per spot) ──

export function useSpotThumbnails(spotIds: string[]) {
  return useQuery<Record<string, string>>({
    queryKey: [SPOT_THUMBNAILS_KEY, spotIds],
    queryFn: () => photosRepo.getFirstPhotosForSpots(spotIds),
    enabled: spotIds.length > 0,
    staleTime: 60_000,
  });
}

// ── Create ──

export function useCreateSpot() {
  const qc = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (input: {
      spot: spotsRepo.CreateSpotPayload;
      tags: string[];
      photoUris: string[];
    }) => {
      const spot = await spotsRepo.createSpot(input.spot);

      // Save tags
      if (input.tags.length > 0) {
        await tagsRepo.setTagsForSpot(spot.id, input.tags);
      }

      // Upload and save photos
      if (input.photoUris.length > 0 && user) {
        for (const uri of input.photoUris) {
          const publicUrl = await photoService.uploadPhoto(
            uri,
            user.id,
            spot.id
          );
          await photosRepo.addPhotoRecord(spot.id, publicUrl);
        }
      }

      return spot;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [SPOTS_KEY] });
    },
  });
}

// ── Update ──

export function useUpdateSpot() {
  const qc = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (input: {
      id: string;
      spot: spotsRepo.UpdateSpotPayload;
      tags: string[];
      newPhotoUris: string[];
    }) => {
      const spot = await spotsRepo.updateSpot(input.id, input.spot);
      await tagsRepo.setTagsForSpot(input.id, input.tags);

      // Upload new photos
      if (input.newPhotoUris.length > 0 && user) {
        for (const uri of input.newPhotoUris) {
          const publicUrl = await photoService.uploadPhoto(
            uri,
            user.id,
            input.id
          );
          await photosRepo.addPhotoRecord(input.id, publicUrl);
        }
      }

      return spot;
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: [SPOTS_KEY] });
      qc.invalidateQueries({ queryKey: [SPOT_DETAIL_KEY, vars.id] });
      qc.invalidateQueries({ queryKey: [SPOT_TAGS_KEY, vars.id] });
      qc.invalidateQueries({ queryKey: [SPOT_PHOTOS_KEY, vars.id] });
    },
  });
}

// ── Delete ──

export function useDeleteSpot() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      // Clean up photos from storage before deleting spot
      try {
        const photos = await photosRepo.getPhotosForSpot(id);
        for (const photo of photos) {
          const path = extractStoragePath(photo.image_url);
          if (path) {
            await photoService.deletePhoto(path);
          }
        }
      } catch {
        // Storage cleanup is best-effort; don't block deletion
      }
      return spotsRepo.deleteSpot(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [SPOTS_KEY] });
    },
  });
}
