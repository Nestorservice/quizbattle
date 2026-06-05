import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors, Typography, Spacing } from '../../constants/theme';

interface EmptyStateProps {
  icon: string;
  title: string;
  subtitle?: string;
  style?: ViewStyle;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, subtitle, style }) => {
  return (
    <View style={[styles.container, style]}>
      <Icon name={icon} size={48} color={Colors.textTertiary} />
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
    gap: Spacing.sm,
  },
  title: {
    fontFamily: Typography.fontBodyMedium,
    fontSize: Typography.sizeH3,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  subtitle: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.sizeBody,
    color: Colors.textTertiary,
    textAlign: 'center',
  },
});
