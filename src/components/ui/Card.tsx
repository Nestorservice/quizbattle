import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Spacing, Radius, Shadow } from '../../constants/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  glow?: boolean;
  padding?: number;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  glow = false,
  padding = Spacing.md,
}) => {
  return (
    <View style={[styles.card, glow && styles.glow, { padding }, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.bgSurface,
    borderRadius: Radius.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  glow: {
    borderColor: Colors.borderActive,
    ...Shadow.card,
  },
});
