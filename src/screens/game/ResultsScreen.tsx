import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';
import { useTeamsStore } from '../../stores/teamsStore';
import { useGameStore } from '../../stores/gameStore';
import { useHistoryStore } from '../../stores/historyStore';
import { Team } from '../../types/team';
import { Button } from '../../components/ui/Button';
import { Colors, Typography, Spacing, Radius } from '../../constants/theme';
import { rankTeams } from '../../utils/scoring';

type Nav = StackNavigationProp<RootStackParamList>;

const RANK_COLORS = [Colors.accentPrimary, Colors.textSecondary, '#CD7F32'];
const RANK_ICONS = ['trophy', 'medal', 'medal-outline'];
const PODIUM_HEIGHTS = [120, 90, 70];

interface PodiumBarProps {
  rankIdx: number;
  teamName: string;
  score: number;
  delay: number;
}

const PodiumBar: React.FC<PodiumBarProps> = ({ rankIdx, teamName, score, delay }) => {
  const scaleY = useSharedValue(0);

  useEffect(() => {
    scaleY.value = withDelay(delay, withSpring(1, { damping: 12, stiffness: 150 }));
  }, [scaleY, delay]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scaleY: scaleY.value }],
  }));

  return (
    <View style={styles.podiumSlot}>
      <Icon name={RANK_ICONS[rankIdx]} size={24} color={RANK_COLORS[rankIdx]} />
      <Text style={[styles.podiumTeam, { color: RANK_COLORS[rankIdx] }]} numberOfLines={1}>
        {teamName}
      </Text>
      <Text style={styles.podiumScore}>{score}</Text>
      <Animated.View
        style={[
          styles.podiumBar,
          {
            height: PODIUM_HEIGHTS[rankIdx],
            backgroundColor: RANK_COLORS[rankIdx] + '33',
            borderTopColor: RANK_COLORS[rankIdx],
          },
          animStyle,
        ]}
      />
    </View>
  );
};

export const ResultsScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const { teams, scores, reset: resetTeams } = useTeamsStore();
  const { config, questions, reset: resetGame } = useGameStore();
  const { addGame } = useHistoryStore();

  const ranked = rankTeams(scores);
  const podium = ranked.slice(0, 3);

  const findTeam = (teamId: string): Team | undefined =>
    teams.find(t => t.id === teamId);

  useEffect(() => {
    if (config) {
      addGame({
        id: `game_${Date.now()}`,
        subject: config.subject,
        difficulty: config.difficulty,
        playedAt: new Date().toISOString(),
        playerCount: teams.length,
        results: ranked.map(r => {
          const team = findTeam(r.teamId);
          return {
            teamId: r.teamId,
            teamName: team?.name ?? '',
            members: team?.members ?? [],
            score: r.score,
            rank: r.rank,
            correctAnswers: 0,
            totalQuestions: questions.length,
            avgResponseTime: 0,
          };
        }),
      });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleReplay = () => {
    resetGame();
    navigation.navigate('Game', { screen: 'QuizConfig' });
  };

  const handleHome = () => {
    resetGame();
    resetTeams();
    navigation.navigate('Main', { screen: 'Home' });
  };

  // Ordre visuel podium: 2e à gauche, 1er au centre, 3e à droite
  const podiumOrder = [1, 0, 2];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Résultats</Text>
      <Text style={styles.subtitle}>{config?.subject}</Text>

      {/* Podium */}
      <View style={styles.podiumContainer}>
        {podiumOrder.map((rankIdx, colIdx) => {
          const entry = podium[rankIdx];
          if (!entry) return <View key={rankIdx} style={styles.podiumSlot} />;
          const team = findTeam(entry.teamId);
          return (
            <PodiumBar
              key={entry.teamId}
              rankIdx={rankIdx}
              teamName={team?.name ?? ''}
              score={entry.score}
              delay={colIdx * 200}
            />
          );
        })}
      </View>

      {/* Classement complet */}
      <Text style={styles.sectionTitle}>Classement complet</Text>
      {ranked.map(entry => {
        const team = findTeam(entry.teamId);
        return (
          <View key={entry.teamId} style={styles.rankRow}>
            <Text style={styles.rankNum}>#{entry.rank}</Text>
            <Icon
              name={team?.icon ?? 'account-group'}
              size={20}
              color={team?.color ?? Colors.textSecondary}
            />
            <Text style={styles.rankTeamName}>{team?.name ?? ''}</Text>
            <Text style={styles.rankScore}>{entry.score} pts</Text>
          </View>
        );
      })}

      <View style={styles.actions}>
        <Button label="Rejouer" onPress={handleReplay} variant="secondary" fullWidth />
        <Button label="Accueil" onPress={handleHome} variant="primary" fullWidth />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary },
  content: { paddingTop: 56, paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xxl },
  title: {
    fontFamily: Typography.fontDisplay,
    fontSize: Typography.sizeDisplay,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.sizeBody,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  podiumContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    height: 220,
    marginBottom: Spacing.xl,
    gap: Spacing.sm,
  },
  podiumSlot: {
    flex: 1,
    alignItems: 'center',
    gap: Spacing.xs,
  },
  podiumTeam: {
    fontFamily: Typography.fontBodyMedium,
    fontSize: Typography.sizeCaption,
    textAlign: 'center',
  },
  podiumScore: {
    fontFamily: Typography.fontDisplay,
    fontSize: Typography.sizeH3,
    color: Colors.textPrimary,
  },
  podiumBar: {
    width: '100%',
    borderTopWidth: 2,
    borderRadius: 4,
  },
  sectionTitle: {
    fontFamily: Typography.fontDisplay,
    fontSize: Typography.sizeH3,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  rankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.bgSurface,
    borderRadius: Radius.card,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  rankNum: {
    fontFamily: Typography.fontDisplay,
    fontSize: Typography.sizeH3,
    color: Colors.textTertiary,
    width: 28,
  },
  rankTeamName: {
    flex: 1,
    fontFamily: Typography.fontBodyMedium,
    fontSize: Typography.sizeBody,
    color: Colors.textPrimary,
  },
  rankScore: {
    fontFamily: Typography.fontDisplay,
    fontSize: Typography.sizeH3,
    color: Colors.accentPrimary,
  },
  actions: {
    gap: Spacing.sm,
    marginTop: Spacing.xl,
  },
});
