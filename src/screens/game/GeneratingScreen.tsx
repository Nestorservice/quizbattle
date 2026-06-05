import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { GameStackParamList } from '../../navigation/types';
import { useGameStore } from '../../stores/gameStore';
import { useProfileStore } from '../../stores/profileStore';
import { useGroqQuiz } from '../../hooks/useGroqQuiz';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Colors, Typography, Spacing } from '../../constants/theme';
import { Config } from '../../constants/config';

type Nav = StackNavigationProp<GameStackParamList, 'Generating'>;

const MESSAGES = [
  'Analyse de vos profils...',
  'Calibration du niveau...',
  'Rédaction des questions...',
  'Vérification des réponses...',
  'Synchronisation Bluetooth...',
];

export const GeneratingScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const { config, setQuestions, setStatus } = useGameStore();
  const { profile } = useProfileStore();
  const { generate, isFallback } = useGroqQuiz();
  const [msgIndex, setMsgIndex] = useState(0);
  const [done, setDone] = useState(false);

  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.15, { duration: 800, easing: Easing.out(Easing.ease) }),
        withTiming(0.9, { duration: 800, easing: Easing.in(Easing.ease) }),
      ),
      -1,
      true,
    );
  }, [scale]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex(prev => (prev + 1) % MESSAGES.length);
    }, Config.messageChangeInterval);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!config || !profile) return;

    generate(config, profile).then(questions => {
      setQuestions(questions);
      setStatus('playing');
      navigation.replace('GameScreen');
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const ringStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.ring, ringStyle]}>
        <Text style={styles.ringText}>QB</Text>
      </Animated.View>

      <Text style={styles.message}>{MESSAGES[msgIndex]}</Text>
      {isFallback && (
        <Text style={styles.fallback}>Mode hors-ligne activé</Text>
      )}

      <View style={styles.progressContainer}>
        <ProgressBar progress={0.6} color={Colors.accentPrimary} height={3} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xl,
    padding: Spacing.xl,
  },
  ring: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.bgSurface,
    borderWidth: 3,
    borderColor: Colors.accentPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.accentPrimary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 12,
  },
  ringText: {
    fontFamily: Typography.fontDisplay,
    fontSize: 36,
    color: Colors.accentPrimary,
  },
  message: {
    fontFamily: Typography.fontBodyMedium,
    fontSize: Typography.sizeH3,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  fallback: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.sizeCaption,
    color: Colors.accentDanger,
    textAlign: 'center',
  },
  progressContainer: {
    width: '80%',
  },
});
