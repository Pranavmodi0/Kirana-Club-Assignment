import React, { useState } from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';

export interface GIFCardProps {
  gifUrl: string;
  stillUrl: string;
  onPress: () => void;
}

const GIFCard: React.FC<GIFCardProps> = ({ gifUrl, stillUrl, onPress }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    onPress();
  };

  return (
    <TouchableOpacity onPress={togglePlayPause} style={styles.card}>
      <Image
        source={{ uri: isPlaying ? gifUrl : stillUrl }}
        style={styles.image}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 5,
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 150,
  },
});

export default GIFCard;