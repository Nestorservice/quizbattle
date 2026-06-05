import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';
import { useProfileStore } from '../../stores/profileStore';
import { useHistoryStore } from '../../stores/historyStore';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { EmptyState } from '../../components/ui/EmptyState';
import { Colors, Typography, Spacing, Radius } from '../../constants/theme';

type Nav = StackNavigationProp<RootStackParamList>;

const LEVEL_LABELS = {
  beginner: 'Débutant',
  intermediate: 'Intermédiaire',
  expert: 'Expert',
};

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const { profile } = useProfileStore();
  const { history, loadHistory, syncFromSupabase } = useHistoryStore();
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const onRefresh = async () => {
    setRefreshing(true);
    if (profile?.deviceId) {
      await syncFromSupabase(profile.deviceId);
    }
    setRefreshing(false);
  };

  if (!profile) return null;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={Colors.accentPrimary}
        />
      }>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Avatar name={profile.pseudo} size={44} />
          <View>
            <Text style={styles.greeting}>Bonjour,</Text>
            <Text style={styles.pseudo}>{profile.pseudo}</Text>
          </View>
        </View>
        <Badge label={LEVEL_LABELS[profile.level]} variant="primary" />
      </View>

      {/* Actions principales */}
      <View style={styles.actionsSection}>
        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate('Game', { screen: 'Lobby' })}>
          <View style={[styles.actionIcon, { backgroundColor: 'rgba(240,201,58,0.12)' }]}>
            <Icon name="account-group" size={28} color={Colors.accentPrimary} />
          </View>
          <View style={styles.actionText}>
            <Text style={styles.actionTitle}>Créer une partie</Text>
            <Text style={styles.actionSubtitle}>Héberge une session en Bluetooth</Text>
          </View>
          <Icon name="chevron-right" size={20} color={Colors.textTertiary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate('Game', { screen: 'JoinLobby' })}>
          <View style={[styles.actionIcon, { backgroundColor: 'rgba(58,142,240,0.12)' }]}>
            <Icon name="bluetooth-connect" size={28} color={Colors.accentSecondary} />
          </View>
          <View style={styles.actionText}>
            <Text style={styles.actionTitle}>Rejoindre une partie</Text>
            <Text style={styles.actionSubtitle}>Scan Bluetooth des sessions proches</Text>
          </View>
          <Icon name="chevron-right" size={20} color={Colors.textTertiary} />
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <Text style={styles.sectionTitle}>Mes statistiques</Text>
      <View style={styles.statsRow}>
        {[
          { label: 'Parties', value: String(history.length), icon: 'gamepad-variant' },
          { label: 'Sessions', value: String(history.length), icon: 'trophy' },
          { label: 'Domaines', value: String(profile.interests.length), icon: 'star' },
        ].map(stat => (
          <Card key={stat.label} style={styles.statCard}>
            <Icon name={stat.icon} size={20} color={Colors.accentPrimary} />
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </Card>
        ))}
      </View>

      {/* Historique */}
      <Text style={styles.sectionTitle}>Historique</Text>
      {history.length === 0 ? (
        <EmptyState
          icon="history"
          title="Aucune partie jouée"
          subtitle="Lance ta première partie !"
        />
      ) : (
        history.map(game => (
          <Card key={game.id} style={styles.historyCard}>
            <View style={styles.historyRow}>
              <View style={styles.historyLeft}>
                <Text style={styles.historySubject}>{game.subject}</Text>
                <Text style={styles.historyMeta}>
                  {game.playerCount} joueurs · {game.difficulty}
                </Text>
              </View>
              <Text style={styles.historyDate}>
                {new Date(game.playedAt).toLocaleDateString('fr-FR', {
                  day: '2-digit',
                  month: 'short',
                })}
              </Text>
            </View>
          </Card>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
  },
  content: {
    paddingTop: 56,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  greeting: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.sizeCaption,
    color: Colors.textTertiary,
  },
  pseudo: {
    fontFamily: Typography.fontDisplay,
    fontSize: Typography.sizeH2,
    color: Colors.textPrimary,
  },
  actionsSection: {
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgSurface,
    borderRadius: Radius.card,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    gap: Spacing.md,
  },
  actionIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    flex: 1,
  },
  actionTitle: {
    fontFamily: Typography.fontBodyMedium,
    fontSize: Typography.sizeH3,
    color: Colors.textPrimary,
  },
  actionSubtitle: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.sizeCaption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  sectionTitle: {
    fontFamily: Typography.fontDisplay,
    fontSize: Typography.sizeH3,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.md,
  },
  statValue: {
    fontFamily: Typography.fontDisplay,
    fontSize: Typography.sizeH1,
    color: Colors.textPrimary,
  },
  statLabel: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.sizeCaption,
    color: Colors.textSecondary,
  },
  historyCard: {
    marginBottom: Spacing.sm,
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyLeft: {
    flex: 1,
  },
  historySubject: {
    fontFamily: Typography.fontBodyMedium,
    fontSize: Typography.sizeBody,
    color: Colors.textPrimary,
  },
  historyMeta: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.sizeCaption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  historyDate: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.sizeCaption,
    color: Colors.textTertiary,
  },
});
