import React, { useEffect } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { Colors, Radius } from '../../constants/theme';

interface ProgressBarProps {
  progress: number; // 0 to 1
  color?: string;
  height?: number;
  style?: ViewStyle;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color = Colors.accentPrimary,
  height = 4,
  style,
}) => {
  const width = useSharedValue(0);

  useEffect(() => {
    width.value = withTiming(progress, { duration: 300 });
  }, [progress, width]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${width.value * 100}%`,
  }));

  return (
    <View style={[styles.track, { height }, style]}>
      <Animated.View style={[styles.fill, { backgroundColor: color, height }, animatedStyle]} />
    </View>
  );
};

const styles = StyleSheet.create({
  track: {
    backgroundColor: Colors.bgSurface3,
    borderRadius: Radius.pill,
    overflow: 'hidden',
    width: '100%',
  },
  fill: {
    borderRadius: Radius.pill,
  },
});
