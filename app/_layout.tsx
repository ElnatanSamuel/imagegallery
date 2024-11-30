import { Stack } from "expo-router";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { Redirect } from "expo-router";
import "../global.css";

export default function RootLayout() {
  return (
    <FavoritesProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
    </FavoritesProvider>
  );
}
