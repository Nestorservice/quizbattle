import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  FadeInRight,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { GameStackParamList } from '../../navigation/types';
import { useGameStore } from '../../stores/gameStore';
import { useTeamsStore } from '../../stores/teamsStore';
import { TimerRing } from '../../components/ui/TimerRing';
import { useTimer } from '../../hooks/useTimer';
import { useHaptics } from '../../hooks/useHaptics';
import { calculateScore } from '../../utils/scoring';
import { Colors, Typography, Spacing, Radius } from '../../constants/theme';
import { Config } from '../../constants/config';

type Nav = StackNavigationProp<GameStackParamList, 'GameScreen'>;

type AnswerState = 'default' | 'selected' | 'correct' | 'wrong' | 'revealed';

export const GameScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const { questions, currentIndex, config, submitAnswer, nextQuestion, markQuestionStart } = useGameStore();
  const { teams, scores, eliminated, updateScore, incrementError, eliminateTeam, checkAutoElimination } = useTeamsStore();
  const haptics = useHaptics();

  const [answerStates, setAnswerStates] = useState<AnswerState[]>(['default', 'default', 'default', 'default']);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [timeProgress, setTimeProgress] = useState(1);
  const [showExplanation, setShowExplanation] = useState(false);
  const explanationY = useSharedValue(40);
  const explanationOpacity = useSharedValue(0);

  const question = questions[currentIndex];
  const timerDuration = config?.timerSeconds ?? 15;

  const handleExpire = useCallback(() => {
    if (!revealed) revealAnswer(-1);
  }, [revealed]); // eslint-disable-line react-hooks/exhaustive-deps

  const { start: startTimer, stop: stopTimer } = useTimer({
    duration: timerDuration,
    onTick: (remaining) => {
      setTimeProgress(remaining / timerDuration);
      if (remaining <= Config.timerWarnThreshold) haptics.warning();
    },
    onExpire: handleExpire,
  });

  useEffect(() => {
    if (!question) return;
    setAnswerStates(['default', 'default', 'default', 'default']);
    setSelectedIndex(null);
    setRevealed(false);
    setShowExplanation(false);
    setTimeProgress(1);
    explanationY.value = 40;
    explanationOpacity.value = 0;
    markQuestionStart();
    startTimer();
  }, [currentIndex, question]); // eslint-disable-line react-hooks/exhaustive-deps

  const revealAnswer = (pickedIndex: number) => {
    stopTimer();
    setRevealed(true);

    const newStates: AnswerState[] = question.options.map((_, i) => {
      if (i === question.correct_index) return 'correct';
      if (i === pickedIndex && pickedIndex !== question.correct_index) return 'wrong';
      return 'default';
    });
    setAnswerStates(newStates);

    explanationY.value = withSpring(0, { damping: 14, stiffness: 180 });
    explanationOpacity.value = withTiming(1, { duration: 250 });
    setShowExplanation(true);

    setTimeout(() => {
      nextQuestion();
      if (useGameStore.getState().status === 'finished') {
        navigation.replace('Results');
      }
    }, Config.nextQuestionDelay);
  };

  const handleAnswer = (index: number) => {
    if (revealed || selectedIndex !== null) return;

    setSelectedIndex(index);
    const newStates: AnswerState[] = ['default', 'default', 'default', 'default'];
    newStates[index] = 'selected';
    setAnswerStates(newStates);

    setTimeout(() => revealAnswer(index), Config.answerRevealDelay);

    const isCorrect = index === question.correct_index;
    if (isCorrect) {
      haptics.success();
    } else {
      haptics.error();
    }
  };

  const explanationStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: explanationY.value }],
    opacity: explanationOpacity.value,
  }));

  const getOptionStyle = (state: AnswerState) => {
    switch (state) {
      case 'correct': return { borderColor: Colors.accentSuccess, backgroundColor: 'rgba(46,204,113,0.1)' };
      case 'wrong': return { borderColor: Colors.accentDanger, backgroundColor: 'rgba(232,69,60,0.1)' };
      case 'selected': return { borderColor: Colors.accentPrimary, backgroundColor: 'rgba(240,201,58,0.08)' };
      default: return {};
    }
  };

  const getOptionIcon = (state: AnswerState) => {
    if (state === 'correct') return <Icon name="check-circle" size={20} color={Colors.accentSuccess} />;
    if (state === 'wrong') return <Icon name="close-circle" size={20} color={Colors.accentDanger} />;
    return null;
  };

  if (!question) return null;

  const activeteams = teams.filter(t => !eliminated[t.id]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.questionCount}>
          {currentIndex + 1} / {questions.length}
        </Text>
        <TimerRing progress={timeProgress} size={56} strokeWidth={4} />
      </View>

      {/* Question */}
      <Animated.View entering={FadeInRight.springify()} key={currentIndex} style={styles.questionContainer}>
        <Text style={styles.questionText}>{question.question}</Text>
      </Animated.View>

      {/* Options */}
      <View style={styles.optionsContainer}>
        {question.options.map((option, index) => {
          const state = answerStates[index];
          return (
            <TouchableOpacity
              key={index}
              style={[styles.optionCard, getOptionStyle(state), revealed && styles.optionDisabled]}
              onPress={() => handleAnswer(index)}
              disabled={revealed || selectedIndex !== null}
              activeOpacity={0.8}>
              <View style={styles.optionIndex}>
                <Text style={styles.optionIndexText}>
                  {['A', 'B', 'C', 'D'][index]}
                </Text>
              </View>
              <Text style={styles.optionText}>{option}</Text>
              {getOptionIcon(state)}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Explication */}
      {showExplanation && (
        <Animated.View style={[styles.explanation, explanationStyle]}>
          <Icon name="information-outline" size={16} color={Colors.accentSecondary} />
          <Text style={styles.explanationText}>{question.explanation}</Text>
        </Animated.View>
      )}

      {/* Scoreboard mini */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scoreboard}>
        {activeteams.map(team => (
          <View key={team.id} style={styles.scoreChip}>
            <Icon name={team.icon} size={14} color={team.color} />
            <Text style={styles.scoreTeamName} numberOfLines={1}>{team.name}</Text>
            <Text style={[styles.scoreValue, { color: team.color }]}>{scores[team.id] ?? 0}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 56,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  questionCount: {
    fontFamily: Typography.fontDisplay,
    fontSize: Typography.sizeH2,
    color: Colors.textPrimary,
  },
  questionContainer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    minHeight: 120,
    justifyContent: 'center',
  },
  questionText: {
    fontFamily: Typography.fontBodyMedium,
    fontSize: Typography.sizeH2,
    color: Colors.textPrimary,
    lineHeight: 30,
  },
  optionsContainer: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
    flex: 1,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgSurface,
    borderRadius: Radius.card,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    gap: Spacing.md,
  },
  optionDisabled: { opacity: 0.85 },
  optionIndex: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.bgSurface3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionIndexText: {
    fontFamily: Typography.fontBodyMedium,
    fontSize: Typography.sizeCaption,
    color: Colors.textSecondary,
  },
  optionText: {
    flex: 1,
    fontFamily: Typography.fontBody,
    fontSize: Typography.sizeBody,
    color: Colors.textPrimary,
  },
  explanation: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    margin: Spacing.lg,
    padding: Spacing.md,
    backgroundColor: 'rgba(58,142,240,0.08)',
    borderRadius: Radius.card,
    borderWidth: 1,
    borderColor: 'rgba(58,142,240,0.2)',
  },
  explanationText: {
    flex: 1,
    fontFamily: Typography.fontBody,
    fontSize: Typography.sizeCaption,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  scoreboard: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    maxHeight: 48,
  },
  scoreChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.bgSurface,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    marginRight: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  scoreTeamName: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.sizeCaption,
    color: Colors.textSecondary,
    maxWidth: 60,
  },
  scoreValue: {
    fontFamily: Typography.fontDisplay,
    fontSize: Typography.sizeCaption,
  },
});
