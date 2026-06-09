import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useProfileStore } from '../../stores/profileStore';
import { useHistoryStore } from '../../stores/historyStore';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Colors, Typography, Spacing } from '../../constants/theme';
import { SUBJECTS } from '../../constants/subjects';

const LEVEL_LABELS = {
  beginner: 'Débutant',
  intermediate: 'Intermédiaire',
  expert: 'Expert',
};

export const ProfileScreen: React.FC = () => {
  const { profile, clearProfile } = useProfileStore();
  const { history } = useHistoryStore();

  const handleReset = () => {
    Alert.alert(
      'Réinitialiser',
      'Supprimer toutes les données de l\'application ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Réinitialiser',
          style: 'destructive',
          onPress: clearProfile,
        },
      ],
    );
  };

  if (!profile) return null;

  const interests = SUBJECTS.filter(s => profile.interests.includes(s.id));

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Avatar name={profile.pseudo} size={72} />
        <Text style={styles.pseudo}>{profile.pseudo}</Text>
        <Badge label={LEVEL_LABELS[profile.level]} variant="primary" />
        {profile.bio ? <Text style={styles.bio}>{profile.bio}</Text> : null}
      </View>

      <Text style={styles.sectionTitle}>Informations</Text>
      <Card style={styles.infoCard}>
        {[
          { icon: 'calendar', label: 'Âge', value: profile.ageRange },
          { icon: 'identifier', label: 'Device ID', value: profile.deviceId.slice(0, 16) + '...' },
          { icon: 'clock-outline', label: 'Inscrit le', value: new Date(profile.createdAt).toLocaleDateString('fr-FR') },
        ].map(item => (
          <View key={item.label} style={styles.infoRow}>
            <Icon name={item.icon} size={16} color={Colors.textTertiary} />
            <Text style={styles.infoLabel}>{item.label}</Text>
            <Text style={styles.infoValue}>{item.value}</Text>
          </View>
        ))}
      </Card>

      <Text style={styles.sectionTitle}>Domaines d'intérêt</Text>
      <View style={styles.interestsRow}>
        {interests.map(s => (
          <View key={s.id} style={styles.interestChip}>
            <Icon name={s.icon} size={14} color={Colors.accentPrimary} />
            <Text style={styles.interestLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Statistiques</Text>
      <View style={styles.statsRow}>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>{history.length}</Text>
          <Text style={styles.statLabel}>Parties</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>{profile.interests.length}</Text>
          <Text style={styles.statLabel}>Domaines</Text>
        </Card>
      </View>

      <Button
        label="Réinitialiser l'application"
        onPress={handleReset}
        variant="danger"
        fullWidth
        style={styles.resetBtn}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary },
  content: { paddingTop: 56, paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xxl },
  header: {
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  pseudo: {
    fontFamily: Typography.fontDisplay,
    fontSize: Typography.sizeH1,
    color: Colors.textPrimary,
    marginTop: Spacing.sm,
  },
  bio: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.sizeBody,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.xs,
  },
  sectionTitle: {
    fontFamily: Typography.fontDisplay,
    fontSize: Typography.sizeH3,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
    marginTop: Spacing.md,
  },
  infoCard: { gap: Spacing.sm },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  infoLabel: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.sizeBody,
    color: Colors.textSecondary,
    flex: 1,
  },
  infoValue: {
    fontFamily: Typography.fontBodyMedium,
    fontSize: Typography.sizeBody,
    color: Colors.textPrimary,
  },
  interestsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  interestChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(240,201,58,0.1)',
    borderRadius: 999,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(240,201,58,0.2)',
  },
  interestLabel: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.sizeCaption,
    color: Colors.accentPrimary,
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
  resetBtn: { marginTop: Spacing.md },
});
