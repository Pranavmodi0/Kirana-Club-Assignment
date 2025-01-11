import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Text,
  Share,
} from 'react-native';
import GIFCard from '../../components/GIFCard';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { GiphyData, GiphyApiResponse } from '../../api/giphy';

const GIPHY_API_KEY = 'Api Key';

const HomeScreen: React.FC<{ isDarkMode: boolean; toggleTheme: () => void }> = ({
  isDarkMode,
  toggleTheme,
}) => {
  const [gifs, setGifs] = useState<GiphyData[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [offset, setOffset] = useState(0);
  const [isPlaying, setIsPlaying] = useState<{ [key: string]: boolean }>({});

  const fetchTrendingGIFs = async (newOffset: number = offset) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/trending?api_key=${GIPHY_API_KEY}&limit=20&offset=${newOffset}&rating=g`
      );
      const data: GiphyApiResponse = await response.json();
      setGifs((prevGifs) => [...prevGifs, ...data.data]);
      setOffset(newOffset + 20);
    } catch (error) {
      console.error('Error fetching trending GIFs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSearchedGIFs = async () => {
    if (!searchTerm) return;
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${searchTerm}&limit=50&rating=g`
      );
      const data: GiphyApiResponse = await response.json();
      setGifs(data.data);
    } catch (error) {
      console.error('Error fetching searched GIFs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleScrollEnd = () => {
    if (!loading) {
      fetchTrendingGIFs();
    }
  };

  const togglePlayPause = (id: string) => {
    setIsPlaying((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const downloadGIF = async (url: string) => {
    try {
      const permission = await MediaLibrary.requestPermissionsAsync();
      if (permission.granted) {
        const fileUri = `${FileSystem.documentDirectory}${url.split('/').pop()}`;
        const { uri } = await FileSystem.downloadAsync(url, fileUri);
        await MediaLibrary.createAssetAsync(uri);
        alert('GIF downloaded successfully!');
      } else {
        alert('Permission to access media library is required.');
      }
    } catch (error) {
      console.error('Error downloading GIF:', error);
    }
  };

  const shareGIF = async (url: string) => {
    try {
      await Share.share({
        message: url,
      });
    } catch (error) {
      console.error('Error sharing GIF:', error);
    }
  };

  useEffect(() => {
    fetchTrendingGIFs();
  }, []);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDarkMode ? '#333' : '#fff',
        },
      ]}
    >
      <TextInput
          style={[
            styles.searchInput,
            {
              color: isDarkMode ? '#fff' : '#000',
            },
          ]}
          placeholder="Search GIFs..."
          placeholderTextColor={isDarkMode ? '#ccc' : '#aaa'}
          value={searchTerm}
          onChangeText={(text) => setSearchTerm(text)}
          onSubmitEditing={fetchSearchedGIFs}
      />

{/*       <TouchableOpacity
        onPress={toggleTheme}
        style={[
          styles.toggleButton,
          {
            backgroundColor: isDarkMode ? '#555' : '#ddd',
          },
        ]}
      >
        <Text style={[styles.toggleButtonText, { color: isDarkMode ? '#fff' : '#000' }]}>
          Toggle Theme
        </Text>
      </TouchableOpacity> */}

      {loading && gifs.length === 0 ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
  data={gifs}
  keyExtractor={(item, index) => `${item.id}-${index}`}
  numColumns={2}
  renderItem={({ item }) => {
    const isGifPlaying = isPlaying[item.id] ?? false;
    return (
      <View style={styles.gifContainer}>
        <TouchableOpacity onPress={() => togglePlayPause(item.id)}>
          <GIFCard
            gifUrl={
              isGifPlaying
                ? item.images.fixed_width.url
                : item.images.fixed_width_still.url
            }
            onPress={() => togglePlayPause(item.id)}
            stillUrl={item.images.fixed_width_still.url}
          />
        </TouchableOpacity>

        {}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            onPress={() => downloadGIF(item.images.original.url)}
            style={styles.actionButton}
          >
            <Text style={styles.actionText}>Download</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => shareGIF(item.images.original.url)}
            style={styles.actionButton}
          >
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }}
  columnWrapperStyle={styles.row}
  contentContainerStyle={styles.gridContainer}
  onEndReached={handleScrollEnd}
  onEndReachedThreshold={0.5}
  ListFooterComponent={loading ? <ActivityIndicator size="small" color="#0000ff" /> : null}
/>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  searchInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    marginTop: 20,
  },
  toggleButton: {
    padding: 10,
    marginVertical: 10,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  row: {
    justifyContent: 'space-between',
  },
  gridContainer: {
    flexGrow: 1,
  },
  gifContainer: {
    flex: 1,
    margin: 5,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  actionButton: {
    backgroundColor: '#007bff',
    padding: 5,
    borderRadius: 5,
  },
  actionText: {
    color: '#fff',
  },
});

export default HomeScreen;
