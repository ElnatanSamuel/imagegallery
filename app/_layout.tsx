import { Stack } from "expo-router";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { View } from "react-native";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import '../global.css';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <FavoritesProvider>
        <Stack 
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#111827' },
          }}
        >
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="index" options={{ headerShown: false }} />
        </Stack>
      </FavoritesProvider>
    </SafeAreaProvider>
  );
}