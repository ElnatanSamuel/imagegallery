import { StyleSheet, TextInput, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [searchText, setSearchText] = useState("");
  const [debouncedValue] = useDebounce(searchText, 300); // Reduced debounce time to 300ms

  // Effect for debounced search
  useEffect(() => {
    if (debouncedValue.trim()) {
      onSearch(debouncedValue);
    } else if (debouncedValue === "") {
      onSearch("nature"); // Default search when cleared
    }
  }, [debouncedValue, onSearch]);

  const handleClear = () => {
    setSearchText("");
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Search images..."
          value={searchText}
          onChangeText={setSearchText}
          placeholderTextColor="#666"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          onSubmitEditing={() => searchText.trim() && onSearch(searchText)}
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={handleClear}>
            <Ionicons name="close-circle" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 8,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    padding: 10,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#000",
    padding: 0,
  },
});
