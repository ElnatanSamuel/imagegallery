import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "@/hooks/useImages";

interface FavoritesContextType {
  favorites: Image[];
  isLoading: boolean;
  toggleFavorite: (image: Image) => Promise<void>;
  isFavorite: (id: string) => boolean;
  refreshFavorites: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

const FAVORITES_KEY = "gallery_favorites";

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<Image[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadFavorites = async () => {
    try {
      setIsLoading(true);
      const storedFavorites = await AsyncStorage.getItem(FAVORITES_KEY);
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error("Error loading favorites:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadFavorites();
  }, []);

  const saveFavorites = async (newFavorites: Image[]) => {
    try {
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
      setFavorites(newFavorites); // Update state after successful save
    } catch (error) {
      console.error("Error saving favorites:", error);
    }
  };

  const toggleFavorite = useCallback(
    async (image: Image) => {
      try {
        const isFav = favorites.some((fav) => fav.id === image.id);
        let newFavorites: Image[];

        if (isFav) {
          newFavorites = favorites.filter((fav) => fav.id !== image.id);
        } else {
          newFavorites = [...favorites, image];
        }

        await saveFavorites(newFavorites);
      } catch (error) {
        console.error("Error toggling favorite:", error);
      }
    },
    [favorites]
  );

  const isFavorite = useCallback(
    (id: string) => {
      return favorites.some((fav) => fav.id === id);
    },
    [favorites]
  );

  const refreshFavorites = useCallback(async () => {
    await loadFavorites();
  }, []);

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        isLoading,
        toggleFavorite,
        isFavorite,
        refreshFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}
