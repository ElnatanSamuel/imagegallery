import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from './useImages';

const FAVORITES_KEY = 'gallery_favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<Image[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load favorites when the hook is initialized
  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      setIsLoading(true);
      const storedFavorites = await AsyncStorage.getItem(FAVORITES_KEY);
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveFavorites = async (newFavorites: Image[]) => {
    try {
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  };

  const toggleFavorite = useCallback(async (image: Image) => {
    try {
      const isFav = favorites.some(fav => fav.id === image.id);
      let newFavorites: Image[];
      
      if (isFav) {
        newFavorites = favorites.filter(fav => fav.id !== image.id);
      } else {
        newFavorites = [...favorites, image];
      }
      
      setFavorites(newFavorites);
      await saveFavorites(newFavorites);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  }, [favorites]);

  const isFavorite = useCallback((id: string) => {
    return favorites.some(fav => fav.id === id);
  }, [favorites]);

  return {
    favorites,
    isLoading,
    toggleFavorite,
    isFavorite,
  };
}