import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Typography, Spacing, Radius } from '../../constants/theme';

type BadgeVariant = 'default' | 'success' | 'danger' | 'primary' | 'secondary';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({ label, variant = 'default', style }) => {
  return (
    <View style={[styles.badge, styles[variant], style]}>
      <Text style={[styles.text, styles[`${variant}Text`]]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.pill,
    alignSelf: 'flex-start',
  },
  default: { backgroundColor: Colors.bgSurface3 },
  success: { backgroundColor: 'rgba(46,204,113,0.15)' },
  danger: { backgroundColor: 'rgba(232,69,60,0.15)' },
  primary: { backgroundColor: 'rgba(240,201,58,0.15)' },
  secondary: { backgroundColor: 'rgba(58,142,240,0.15)' },
  text: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.sizeCaption,
    fontWeight: '600',
  },
  defaultText: { color: Colors.textSecondary },
  successText: { color: Colors.accentSuccess },
  dangerText: { color: Colors.accentDanger },
  primaryText: { color: Colors.accentPrimary },
  secondaryText: { color: Colors.accentSecondary },
});
