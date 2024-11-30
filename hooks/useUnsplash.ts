import { useState, useCallback } from "react";
import { Image } from "./useImages";

const UNSPLASH_ACCESS_KEY = "suuKjGKYJPp7JYVoL3KiqricdADflvXnAwlvHgtwN4w";

export function useUnsplash() {
  const [images, setImages] = useState<Image[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [currentQuery, setCurrentQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  const searchImages = useCallback(async (query: string) => {
    if (!query.trim()) return;

    try {
      setIsLoading(true);
      setError(null);
      setCurrentQuery(query);
      setPage(1);

      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${query}&page=1&per_page=20`,
        {
          headers: {
            Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch images");
      }

      const data = await response.json();

      const newImages = data.results.map((item: any) => ({
        id: item.id,
        uri: item.urls.regular,
        photographer: item.user.name,
        timestamp: new Date(item.created_at).getTime(),
      }));

      setImages(newImages);
    } catch (error) {
      console.error("Error fetching images:", error);
      setError("Failed to fetch images. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (!currentQuery || isLoading) return;

    try {
      setIsLoading(true);
      setError(null);
      const nextPage = page + 1;

      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${currentQuery}&page=${nextPage}&per_page=20`,
        {
          headers: {
            Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to load more images");
      }

      const data = await response.json();

      const newImages = data.results.map((item: any) => ({
        id: item.id,
        uri: item.urls.regular,
        photographer: item.user.name,
        timestamp: new Date(item.created_at).getTime(),
      }));

      setImages((prev) => [...prev, ...newImages]);
      setPage(nextPage);
    } catch (error) {
      console.error("Error loading more images:", error);
      setError("Failed to load more images. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [currentQuery, page, isLoading]);

  return {
    images,
    isLoading,
    error,
    searchImages,
    loadMore,
  };
}
