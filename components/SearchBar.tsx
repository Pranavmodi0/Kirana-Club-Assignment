import React, { useState } from 'react';
import { TextInput, StyleSheet, View } from 'react-native';
import { debouncedSearch } from '../utils/debounce';

interface SearchBarProps {
  setGifs: React.Dispatch<React.SetStateAction<any[]>>;
}

const SearchBar: React.FC<SearchBarProps> = ({ setGifs }) => {
  const [query, setQuery] = useState<string>('');

  const handleSearch = (text: string) => {
    setQuery(text);
    debouncedSearch(text, setGifs);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search for GIFs..."
        value={query}
        onChangeText={handleSearch}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingLeft: 10,
    borderRadius: 8,
  },
});

export default SearchBar;