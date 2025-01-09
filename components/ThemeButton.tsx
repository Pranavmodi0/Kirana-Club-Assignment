import React from 'react';
import { Button } from 'react-native';
import { useTheme } from '@react-navigation/native';

const ThemeButton: React.FC = () => {
  const { colors } = useTheme();

  return (
    <Button title="Toggle Theme" color={colors.text} onPress={() => {  }} />
  );
};

export default ThemeButton;