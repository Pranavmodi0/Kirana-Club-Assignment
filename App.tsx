import React, { useState } from 'react';
import { View, StatusBar, StyleSheet } from 'react-native';
import HomeScreen from './app/(tabs)/index';

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode((prevState) => !prevState);
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? '#333' : '#fff' },
      ]}
    >
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <HomeScreen isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;