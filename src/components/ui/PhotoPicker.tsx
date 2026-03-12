import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  StyleSheet,
  ViewStyle,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius, spacing, typography } from "@/theme/tokens";

interface PhotoPickerProps {
  photos: string[];
  onAdd: (uri: string) => void;
  onRemove: (index: number) => void;
  style?: ViewStyle;
  maxPhotos?: number;
}

export function PhotoPicker({
  photos,
  onAdd,
  onRemove,
  style,
  maxPhotos = 5,
}: PhotoPickerProps) {
  const pickImage = async (useCamera: boolean) => {
    const permissionMethod = useCamera
      ? ImagePicker.requestCameraPermissionsAsync
      : ImagePicker.requestMediaLibraryPermissionsAsync;

    const { status } = await permissionMethod();
    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        `Please allow ${useCamera ? "camera" : "photo library"} access in your device settings.`
      );
      return;
    }

    const result = useCamera
      ? await ImagePicker.launchCameraAsync({
          mediaTypes: ["images"],
          quality: 0.8,
        })
      : await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ["images"],
          quality: 0.8,
        });

    if (!result.canceled && result.assets[0]) {
      onAdd(result.assets[0].uri);
    }
  };

  const handleAdd = () => {
    Alert.alert("Add Photo", "Choose a source", [
      { text: "Camera", onPress: () => pickImage(true) },
      { text: "Gallery", onPress: () => pickImage(false) },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>Photos</Text>
        <Text style={styles.countLabel}>{photos.length}/{maxPhotos}</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
        <View style={styles.row}>
          {photos.map((uri, index) => (
            <View key={`${uri}-${index}`} style={styles.photoContainer}>
              <Image source={{ uri }} style={styles.photo} />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => onRemove(index)}
              >
                <Ionicons name="close-outline" size={14} color={colors.white} />
              </TouchableOpacity>
            </View>
          ))}
          {photos.length < maxPhotos && (
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAdd}
              activeOpacity={0.7}
            >
              <View style={styles.addIconCircle}>
                <Ionicons name="camera-outline" size={22} color={colors.primary} />
              </View>
              <Text style={styles.addText}>Add photo</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.base,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  label: {
    ...typography.caption,
    fontWeight: "600",
    color: colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  countLabel: {
    ...typography.small,
    color: colors.textTertiary,
  },
  scrollView: {
    overflow: "visible",
  },
  row: {
    flexDirection: "row",
    gap: spacing.sm,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
    paddingHorizontal: 2,
  },
  photoContainer: {
    position: "relative",
    overflow: "visible",
  },
  photo: {
    width: 100,
    height: 120,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceAlt,
  },
  removeButton: {
    position: "absolute",
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.error,
    borderWidth: 2,
    borderColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  addButton: {
    width: 100,
    height: 120,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.surfaceAlt,
    gap: spacing.xs,
  },
  addIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + "12",
    justifyContent: "center",
    alignItems: "center",
  },
  addText: {
    ...typography.small,
    color: colors.textTertiary,
  },
});
