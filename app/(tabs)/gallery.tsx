import { StyleSheet } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ImageGrid } from "@/components/ImageGrid";
import { SearchBar } from "@/components/SearchBar";
import { useUnsplash } from "@/hooks/useUnsplash";
import { useEffect, useCallback } from "react";

export default function GalleryScreen() {
  const { images, isLoading, searchImages, loadMore } = useUnsplash();

  // Load initial images when component mounts
  useEffect(() => {
    searchImages("nature"); // Default search term
  }, []);

  const handleSearch = useCallback(
    (query: string) => {
      searchImages(query);
    },
    [searchImages]
  );

  const handleLoadMore = useCallback(() => {
    if (!isLoading) {
      loadMore();
    }
  }, [isLoading, loadMore]);

  return (
    <ThemedView style={styles.container}>
      <SearchBar onSearch={handleSearch} />
      <ImageGrid
        images={images}
        isLoading={isLoading}
        onLoadMore={handleLoadMore}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
