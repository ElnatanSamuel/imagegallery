import {
    Modal,
    TouchableOpacity,
    View,
    Image,
    Alert,
    Platform,
    Dimensions,
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
    const { toggleFavorite, isFavorite } = useFavorites();
    const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = Dimensions.get("window");
  
    const handleDownload = async () => {
      if (!image) return;
  
      try {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission Required",
            "Please grant access to save photos to your gallery."
          );
          return;
        }
  
        if (Platform.OS === "ios") {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
  
        const fileUri = `${FileSystem.documentDirectory}${image.id}.jpg`;
        await FileSystem.downloadAsync(image.uri, fileUri);
        await MediaLibrary.saveToLibraryAsync(fileUri);
        await FileSystem.deleteAsync(fileUri);
  
        Alert.alert("Success", "Image saved to gallery!");
      } catch (error) {
        console.error("Error downloading image:", error);
        Alert.alert("Error", "Failed to save image to gallery");
      }
    };
  
    if (!image) return null;
  
    return (
      <Modal
        visible={visible}
        transparent={true}
        animationType="fade"
        onRequestClose={onClose}
      >
        <View className="flex-1 bg-black">
          {/* Header */}
          <View className="flex-row justify-end items-center px-4 pt-12 pb-4 space-x-4 bg-gray-900/50">
            <TouchableOpacity
              className="p-2.5 bg-gray-800 rounded-full active:opacity-70"
              onPress={() => toggleFavorite(image)}
            >
              <Ionicons
                name={isFavorite(image.id) ? "heart" : "heart-outline"}
                size={24}
                color={isFavorite(image.id) ? "#ff4b4b" : "white"}
              />
            </TouchableOpacity>
  
            <TouchableOpacity
              className="p-2.5 bg-gray-800 rounded-full active:opacity-70"
              onPress={handleDownload}
            >
              <Ionicons name="download-outline" size={24} color="white" />
            </TouchableOpacity>
  
            <TouchableOpacity
              className="p-2.5 bg-gray-800 rounded-full active:opacity-70"
              onPress={onClose}
            >
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>
  
          {/* Image */}
          <View className="flex-1 justify-center items-center bg-black">
            <Image
              source={{ uri: image.uri }}
              className="w-full aspect-square"
              style={{
                maxHeight: WINDOW_HEIGHT * 0.7,
                maxWidth: WINDOW_WIDTH,
              }}
              resizeMode="contain"
            />
          </View>
  
          {/* Photographer Info */}
          {image.photographer && (
            <View className="p-5 bg-gray-900/90 backdrop-blur-md">
              <ThemedText className="text-gray-200 text-center text-base font-medium">
                Photo by {image.photographer}
              </ThemedText>
            </View>
          )}
        </View>
      </Modal>
    );
  }