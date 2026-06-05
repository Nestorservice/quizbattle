import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Spacing } from '../../constants/theme';

interface DividerProps {
  style?: ViewStyle;
  vertical?: boolean;
}

export const Divider: React.FC<DividerProps> = ({ style, vertical = false }) => {
  return (
    <View
      style={[
        vertical ? styles.vertical : styles.horizontal,
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  horizontal: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.sm,
  },
  vertical: {
    width: 1,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.sm,
  },
});
