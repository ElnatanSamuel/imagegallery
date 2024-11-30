import { useCallback, useState } from "react";
import {
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  useWindowDimensions,
  View,
} from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { ImageModal } from "@/components/ImageModal";
import { Image as ImageType } from "@/hooks/useImages";
import { useFavorites } from "@/contexts/FavoritesContext";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";

interface ImageGridProps {
  images: ImageType[];
  isLoading: boolean;
  onLoadMore?: () => void;
  isFavoritesScreen?: boolean;
}

export function ImageGrid({
  images,
  isLoading,
  onLoadMore,
  isFavoritesScreen = false,
}: ImageGridProps) {
  const { width } = useWindowDimensions();
  const numColumns = width > 768 ? 3 : 2;
  const ITEM_WIDTH = width / numColumns;

  const [selectedImage, setSelectedImage] = useState<ImageType | null>(null);
  const { toggleFavorite, isFavorite, refreshFavorites } = useFavorites();

  useFocusEffect(
    useCallback(() => {
      refreshFavorites();
    }, [refreshFavorites])
  );

  const handleFavoritePress = async (image: ImageType) => {
    await toggleFavorite(image);
    if (isFavoritesScreen) {
      await refreshFavorites();
    }
  };

  const renderItem = useCallback(
    ({ item: image }: { item: ImageType }) => (
      <View className="p-1" style={{ width: ITEM_WIDTH }}>
        <View className="bg-gray-900 rounded-xl overflow-hidden">
          <TouchableOpacity
            className="relative aspect-square"
            onPress={() => setSelectedImage(image)}
            activeOpacity={0.9}
          >
            <Image
              source={{ uri: image.uri }}
              className="w-full h-full"
              resizeMode="cover"
            />
            <TouchableOpacity
              className="absolute top-2 right-2 bg-black/50 backdrop-blur-md rounded-full p-2.5"
              onPress={() => handleFavoritePress(image)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={isFavorite(image.id) ? "heart" : "heart-outline"}
                size={20}
                color={isFavorite(image.id) ? "#ff4b4b" : "white"}
              />
            </TouchableOpacity>
          </TouchableOpacity>
          {image.photographer && (
            <View className="px-2 py-2 bg-gray-800/90">
              <ThemedText className="text-xs text-center text-gray-300 font-medium truncate">
                {image.photographer}
              </ThemedText>
            </View>
          )}
        </View>
      </View>
    ),
    [ITEM_WIDTH, handleFavoritePress, isFavorite]
  );

  if (isLoading && images.length === 0) {
    return (
      <ThemedView className="flex-1 justify-center items-center bg-gray-900">
        <ActivityIndicator size="large" color="#fff" className="opacity-80" />
      </ThemedView>
    );
  }

  if (images.length === 0 && !isLoading) {
    return (
      <ThemedView className="flex-1 justify-center items-center px-8 bg-gray-900">
        <ThemedText className="text-base text-center text-gray-400">
          {isFavoritesScreen
            ? "No favorite images yet. Try adding some from the gallery!"
            : "No images found"}
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView className="flex-1 bg-gray-900">
      <FlatList
        data={images}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        className="px-0.5"
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isLoading ? (
            <View className="py-6">
              <ActivityIndicator
                size="large"
                color="#fff"
                className="opacity-70"
              />
            </View>
          ) : null
        }
        showsVerticalScrollIndicator={false}
      />

      <ImageModal
        visible={!!selectedImage}
        image={selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </ThemedView>
  );
}
