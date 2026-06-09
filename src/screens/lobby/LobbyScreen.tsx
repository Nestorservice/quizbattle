import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeInDown,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { GameStackParamList } from '../../navigation/types';
import { useTeamsStore } from '../../stores/teamsStore';
import { Team } from '../../types/team';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { Colors, Typography, Spacing, Radius } from '../../constants/theme';
import { CreateTeamSheet } from '../../components/team/CreateTeamSheet';
import { Config } from '../../constants/config';

type Nav = StackNavigationProp<GameStackParamList, 'Lobby'>;

export const LobbyScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const { teams, removeTeam } = useTeamsStore();
  const [sheetVisible, setSheetVisible] = useState(false);

  const fabScale = useSharedValue(1);
  const fabStyle = useAnimatedStyle(() => ({ transform: [{ scale: fabScale.value }] }));

  const canStart = teams.length >= Config.minTeams;

  const handleLongPress = (team: Team) => {
    Alert.alert('Supprimer', `Supprimer l'équipe "${team.name}" ?`, [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Supprimer', style: 'destructive', onPress: () => removeTeam(team.id) },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-left" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Lobby</Text>
        <View style={styles.bleBadge}>
          <Icon name="bluetooth" size={14} color={Colors.accentSecondary} />
          <Text style={styles.bleText}>HOST</Text>
        </View>
      </View>

      <FlatList
        data={teams}
        keyExtractor={t => t.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <EmptyState
            icon="account-group-outline"
            title="Aucune équipe"
            subtitle="Crée au moins 2 équipes pour démarrer"
          />
        }
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInDown.delay(index * 80).springify()}>
            <TouchableOpacity
              style={styles.teamCard}
              onLongPress={() => handleLongPress(item)}
              activeOpacity={0.8}>
              <View style={[styles.teamIcon, { backgroundColor: item.color + '22' }]}>
                <Icon name={item.icon} size={22} color={item.color} />
              </View>
              <View style={styles.teamInfo}>
                <Text style={styles.teamName}>{item.name}</Text>
                <Text style={styles.teamMembers}>
                  {item.members.join(' · ') || 'Aucun membre'}
                </Text>
              </View>
              <Icon name="dots-vertical" size={18} color={Colors.textTertiary} />
            </TouchableOpacity>
          </Animated.View>
        )}
      />

      <View style={styles.footer}>
        <Button
          label={`Lancer le Quiz (${teams.length}/${Config.minTeams} min)`}
          onPress={() => navigation.navigate('QuizConfig')}
          variant="primary"
          fullWidth
          disabled={!canStart}
        />
      </View>

      <Animated.View style={[styles.fab, fabStyle]}>
        <TouchableOpacity
          style={styles.fabBtn}
          onPress={() => setSheetVisible(true)}
          onPressIn={() => { fabScale.value = withSpring(0.9); }}
          onPressOut={() => { fabScale.value = withSpring(1); }}>
          <Icon name="plus" size={28} color={Colors.bgPrimary} />
        </TouchableOpacity>
      </Animated.View>

      <CreateTeamSheet visible={sheetVisible} onClose={() => setSheetVisible(false)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 56,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    gap: Spacing.md,
  },
  backBtn: { padding: Spacing.xs },
  title: {
    flex: 1,
    fontFamily: Typography.fontDisplay,
    fontSize: Typography.sizeH1,
    color: Colors.textPrimary,
  },
  bleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(58,142,240,0.12)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.pill,
  },
  bleText: {
    fontFamily: Typography.fontBodyMedium,
    fontSize: Typography.sizeCaption,
    color: Colors.accentSecondary,
  },
  list: { padding: Spacing.lg, gap: Spacing.sm, paddingBottom: 120 },
  teamCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgSurface,
    borderRadius: Radius.card,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    gap: Spacing.md,
  },
  teamIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  teamInfo: { flex: 1 },
  teamName: {
    fontFamily: Typography.fontBodyMedium,
    fontSize: Typography.sizeH3,
    color: Colors.textPrimary,
  },
  teamMembers: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.sizeCaption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.lg,
    paddingBottom: Spacing.xl,
    backgroundColor: Colors.bgPrimary,
  },
  fab: {
    position: 'absolute',
    bottom: 100,
    right: Spacing.lg,
  },
  fabBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.accentPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.accentPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
});
