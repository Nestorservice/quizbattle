import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Typography } from '../../constants/theme';
import { avatarColor } from '../../utils/avatarColor';

interface AvatarProps {
  name: string;
  size?: number;
}

export const Avatar: React.FC<AvatarProps> = ({ name, size = 40 }) => {
  const color = avatarColor(name);
  const initials = name
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color + '33',
          borderColor: color + '66',
        },
      ]}>
      <Text style={[styles.initials, { fontSize: size * 0.38, color }]}>{initials}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  initials: {
    fontFamily: Typography.fontDisplay,
    fontWeight: '700',
  },
});
