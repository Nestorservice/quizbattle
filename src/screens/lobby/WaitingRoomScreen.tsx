import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors, Typography, Spacing } from '../../constants/theme';

export const WaitingRoomScreen: React.FC = () => {
  const rotation = useSharedValue(0);

  React.useEffect(() => {
    rotation.value = withRepeat(withTiming(360, { duration: 2000 }), -1, false);
  }, [rotation]);

  const spinStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={spinStyle}>
        <Icon name="bluetooth-connect" size={64} color={Colors.accentSecondary} />
      </Animated.View>
      <Text style={styles.title}>En attente...</Text>
      <Text style={styles.subtitle}>Connexion au host établie. En attente du lancement.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.lg,
    padding: Spacing.xl,
  },
  title: {
    fontFamily: Typography.fontDisplay,
    fontSize: Typography.sizeH1,
    color: Colors.textPrimary,
  },
  subtitle: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.sizeBody,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
