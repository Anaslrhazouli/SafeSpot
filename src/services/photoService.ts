import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { supabase } from "@/lib/supabase";

const BUCKET = "spot-photos";

function generatePath(userId: string, spotId: string): string {
  const unique = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  return `${userId}/${spotId}/${unique}.jpg`;
}

export async function uploadPhoto(
  uri: string,
  userId: string,
  spotId: string
): Promise<string> {
  const file = new FileSystem.File(uri);
  const arrayBuffer = await file.arrayBuffer();
  const path = generatePath(userId, spotId);

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, arrayBuffer, {
      contentType: "image/jpeg",
      upsert: false,
    });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function deletePhoto(path: string): Promise<void> {
  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  if (error) throw error;
}

export async function pickFromGallery(): Promise<string | null> {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== "granted") return null;

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    quality: 0.8,
    allowsEditing: true,
    aspect: [4, 3],
  });

  if (result.canceled || !result.assets[0]) return null;
  return result.assets[0].uri;
}

export async function takePhoto(): Promise<string | null> {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  if (status !== "granted") return null;

  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ["images"],
    quality: 0.8,
    allowsEditing: true,
    aspect: [4, 3],
  });

  if (result.canceled || !result.assets[0]) return null;
  return result.assets[0].uri;
}
