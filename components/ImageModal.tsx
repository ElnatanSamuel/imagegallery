import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  Dimensions,
  Alert,
  Platform,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { Image as ImageType } from "@/hooks/useImages";
import { useFavorites } from "@/contexts/FavoritesContext";
import { Ionicons } from "@expo/vector-icons";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import * as Haptics from "expo-haptics";

interface ImageModalProps {
  visible: boolean;
  image: ImageType | null;
  onClose: () => void;
}

export function ImageModal({ visible, image, onClose }: ImageModalProps) {
  const { toggleFavorite, isFavorite, refreshFavorites } = useFavorites();

  if (!image) return null;

  const handleFavoritePress = async () => {
    await toggleFavorite(image);
    await refreshFavorites();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const downloadImage = async () => {
    try {
      // Request permissions first
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission needed",
          "Please grant permission to save images"
        );
        return;
      }

      // Show downloading indicator
      Alert.alert("Downloading...", "Please wait while we download your image");

      // Generate a unique filename
      const filename = `${FileSystem.documentDirectory}${Date.now()}.jpg`;

      // Download the file
      const { uri } = await FileSystem.downloadAsync(image.uri, filename);

      // Save to media library
      const asset = await MediaLibrary.createAssetAsync(uri);
      await MediaLibrary.createAlbumAsync("Gallery App", asset, false);

      // Delete the temporary file
      await FileSystem.deleteAsync(uri);

      // Success feedback
      Alert.alert("Success", "Image saved to your gallery!");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error("Error downloading image:", error);
      Alert.alert("Error", "Failed to download image. Please try again.");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleFavoritePress}
          >
            <Ionicons
              name={isFavorite(image.id) ? "heart" : "heart-outline"}
              size={28}
              color={isFavorite(image.id) ? "#ff4b4b" : "white"}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton} onPress={downloadImage}>
            <Ionicons name="download-outline" size={28} color="white" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton} onPress={onClose}>
            <Ionicons name="close" size={28} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.imageContainer}>
          <Image
            source={{ uri: image.uri }}
            style={styles.fullImage}
            resizeMode="contain"
          />
        </View>

        {image.photographer && (
          <View style={styles.photographerContainer}>
            <ThemedText style={styles.photographerName}>
              Photo by {image.photographer}
            </ThemedText>
          </View>
        )}
      </View>
    </Modal>
  );
}

const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = Dimensions.get("window");

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 20,
    paddingTop: 40,
    gap: 15,
  },
  iconButton: {
    padding: 8,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,
  },
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  fullImage: {
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT * 0.7,
  },
  photographerContainer: {
    padding: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  photographerName: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
  },
});
