import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';
import { useProfileStore } from '../../stores/profileStore';
import { Colors, Typography, Spacing } from '../../constants/theme';
import { Config } from '../../constants/config';

type Nav = StackNavigationProp<RootStackParamList, 'Splash'>;

export const SplashScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const { isOnboarded, loadFromStorage } = useProfileStore();
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  useEffect(() => {
    loadFromStorage();
    opacity.value = withTiming(1, { duration: 400 });
    scale.value = withRepeat(
      withSequence(
        withTiming(1.06, { duration: 700 }),
        withTiming(0.95, { duration: 700 }),
      ),
      -1,
      true,
    );

    const timer = setTimeout(() => {
      if (isOnboarded) {
        navigation.replace('Main', { screen: 'Home' });
      } else {
        navigation.replace('Onboarding', undefined);
      }
    }, Config.splashDuration);

    return () => clearTimeout(timer);
  }, [isOnboarded, navigation, loadFromStorage, scale, opacity]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.logoContainer, animatedStyle]}>
        <Text style={styles.logo}>QB</Text>
      </Animated.View>
      <Text style={styles.title}>QuizBattle</Text>
      <Text style={styles.subtitle}>Joue. Rivalise. Gagne.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 28,
    backgroundColor: Colors.accentPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.accentPrimary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 24,
    elevation: 16,
  },
  logo: {
    fontFamily: Typography.fontDisplay,
    fontSize: 40,
    color: Colors.bgPrimary,
    fontWeight: '700',
  },
  title: {
    fontFamily: Typography.fontDisplay,
    fontSize: Typography.sizeDisplay,
    color: Colors.textPrimary,
    marginTop: Spacing.sm,
  },
  subtitle: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.sizeBody,
    color: Colors.textSecondary,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
});
