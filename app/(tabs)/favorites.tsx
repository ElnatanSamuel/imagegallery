import { StyleSheet } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ImageGrid } from "@/components/ImageGrid";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";

export default function FavoritesScreen() {
  const { favorites, isLoading, refreshFavorites } = useFavorites();

  useFocusEffect(
    useCallback(() => {
      refreshFavorites();
    }, [refreshFavorites])
  );

  return (
    <ThemedView className="flex-1 bg-gray-900">
      <ImageGrid
        images={favorites}
        isLoading={isLoading}
        isFavoritesScreen={true}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
