import { TextInput, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [searchText, setSearchText] = useState("");
  const [debouncedValue] = useDebounce(searchText, 300);

  useEffect(() => {
    if (debouncedValue.trim()) {
      onSearch(debouncedValue);
    } else if (debouncedValue === "") {
      onSearch("nature");
    }
  }, [debouncedValue, onSearch]);

  const handleClear = () => {
    setSearchText("");
  };

  return (
    <View className="px-4 py-3 bg-gray-900 border-b border-gray-800">
      <View className="flex-row items-center bg-gray-800 rounded-xl px-4 py-2.5">
        <Ionicons 
          name="search" 
          size={20} 
          color="#9ca3af"
          className="mr-2" 
        />
        <TextInput
          className="flex-1 text-base text-gray-100"
          placeholder="Search images..."
          value={searchText}
          onChangeText={setSearchText}
          placeholderTextColor="#9ca3af"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          onSubmitEditing={() => searchText.trim() && onSearch(searchText)}
        />
        {searchText.length > 0 && (
          <TouchableOpacity 
            onPress={handleClear}
            className="p-1 -mr-1 active:opacity-70"
          >
            <Ionicons 
              name="close-circle" 
              size={20} 
              color="#9ca3af"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}