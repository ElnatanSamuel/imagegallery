import { useCallback, useState } from "react";
import {
  StyleSheet,
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

const ITEM_SPACING = 8;

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
  const ITEM_WIDTH = (width - (numColumns + 1) * ITEM_SPACING) / numColumns;

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
      <View style={[styles.imageContainer, { width: ITEM_WIDTH }]}>
        <TouchableOpacity
          style={[styles.imageWrapper, { height: ITEM_WIDTH }]}
          onPress={() => setSelectedImage(image)}
        >
          <Image
            source={{ uri: image.uri }}
            style={styles.image}
            resizeMode="cover"
          />
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={() => handleFavoritePress(image)}
          >
            <Ionicons
              name={isFavorite(image.id) ? "heart" : "heart-outline"}
              size={24}
              color={isFavorite(image.id) ? "#ff4b4b" : "white"}
            />
          </TouchableOpacity>
        </TouchableOpacity>
        {image.photographer && (
          <ThemedText style={styles.photographerName} numberOfLines={1}>
            {image.photographer}
          </ThemedText>
        )}
      </View>
    ),
    [ITEM_WIDTH, handleFavoritePress, isFavorite]
  );

  if (isLoading && images.length === 0) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  if (images.length === 0 && !isLoading) {
    return (
      <ThemedView style={styles.emptyContainer}>
        <ThemedText style={styles.emptyText}>
          {isFavoritesScreen
            ? "No favorite images yet. Try adding some from the gallery!"
            : "No images found"}
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={images}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        contentContainerStyle={styles.gridContainer}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isLoading ? (
            <ActivityIndicator style={styles.footer} size="large" />
          ) : null
        }
      />

      <ImageModal
        visible={!!selectedImage}
        image={selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gridContainer: {
    padding: ITEM_SPACING,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
  },
  imageContainer: {
    padding: ITEM_SPACING / 2,
  },
  imageWrapper: {
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  favoriteButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,
    padding: 8,
  },
  photographerName: {
    fontSize: 12,
    marginTop: 4,
    textAlign: "center",
  },
  footer: {
    padding: 20,
  },
});
