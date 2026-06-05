import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { GameStackParamList } from '../../navigation/types';
import { useGameStore } from '../../stores/gameStore';
import { QuizConfig, EliminationMode } from '../../types/quiz';
import { Button } from '../../components/ui/Button';
import { Colors, Typography, Spacing, Radius } from '../../constants/theme';
import { SUBJECTS } from '../../constants/subjects';
import { QuestionCounts, TimerOptions } from '../../constants/config';

type Nav = StackNavigationProp<GameStackParamList, 'QuizConfig'>;

type Difficulty = 'easy' | 'medium' | 'hard';

const DIFFICULTIES: { id: Difficulty; label: string }[] = [
  { id: 'easy', label: 'Facile' },
  { id: 'medium', label: 'Moyen' },
  { id: 'hard', label: 'Expert' },
];

const ELIM_MODES: { id: EliminationMode; label: string; icon: string }[] = [
  { id: 'errors', label: '3 erreurs = éliminé', icon: 'shield-remove' },
  { id: 'last', label: 'Dernier éliminé', icon: 'timer-outline' },
  { id: 'none', label: 'Score pur', icon: 'trophy' },
];

export const QuizConfigScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const { setConfig } = useGameStore();

  const [subject, setSubject] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [questionCount, setQuestionCount] = useState(10);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [eliminationMode, setEliminationMode] = useState<EliminationMode>('none');
  const [timerSeconds, setTimerSeconds] = useState(15);

  const finalSubject = subject.trim() || selectedSubject;
  const canGenerate = finalSubject.length > 0;

  const handleGenerate = () => {
    const config: QuizConfig = {
      subject: finalSubject,
      questionCount,
      difficulty,
      eliminationMode,
      timerSeconds,
    };
    setConfig(config);
    navigation.navigate('Generating');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-left" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Configurer le Quiz</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.label}>Sujet libre</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Histoire de l'Afrique, Python, Cinéma..."
          placeholderTextColor={Colors.textTertiary}
          value={subject}
          onChangeText={text => { setSubject(text); setSelectedSubject(''); }}
        />

        <Text style={styles.label}>Ou choisir un sujet</Text>
        <View style={styles.subjectsGrid}>
          {SUBJECTS.map(s => (
            <TouchableOpacity
              key={s.id}
              style={[styles.subjectCard, selectedSubject === s.id && styles.subjectCardActive]}
              onPress={() => { setSelectedSubject(s.id); setSubject(''); }}>
              <Icon name={s.icon} size={20} color={selectedSubject === s.id ? Colors.accentPrimary : Colors.textSecondary} />
              <Text style={[styles.subjectLabel, selectedSubject === s.id && styles.subjectLabelActive]}>
                {s.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Nombre de questions</Text>
        <View style={styles.optionsRow}>
          {QuestionCounts.map(n => (
            <TouchableOpacity
              key={n}
              style={[styles.optionChip, questionCount === n && styles.optionChipActive]}
              onPress={() => setQuestionCount(n)}>
              <Text style={[styles.optionText, questionCount === n && styles.optionTextActive]}>
                {n}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Difficulté</Text>
        <View style={styles.optionsRow}>
          {DIFFICULTIES.map(d => (
            <TouchableOpacity
              key={d.id}
              style={[styles.optionChip, difficulty === d.id && styles.optionChipActive]}
              onPress={() => setDifficulty(d.id)}>
              <Text style={[styles.optionText, difficulty === d.id && styles.optionTextActive]}>
                {d.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Mode d'élimination</Text>
        {ELIM_MODES.map(m => (
          <TouchableOpacity
            key={m.id}
            style={[styles.elimCard, eliminationMode === m.id && styles.elimCardActive]}
            onPress={() => setEliminationMode(m.id)}>
            <Icon name={m.icon} size={20} color={eliminationMode === m.id ? Colors.accentPrimary : Colors.textSecondary} />
            <Text style={[styles.elimLabel, eliminationMode === m.id && styles.elimLabelActive]}>
              {m.label}
            </Text>
            {eliminationMode === m.id && <Icon name="check" size={16} color={Colors.accentPrimary} />}
          </TouchableOpacity>
        ))}

        <Text style={styles.label}>Durée par question</Text>
        <View style={styles.optionsRow}>
          {TimerOptions.map(t => (
            <TouchableOpacity
              key={t}
              style={[styles.optionChip, timerSeconds === t && styles.optionChipActive]}
              onPress={() => setTimerSeconds(t)}>
              <Text style={[styles.optionText, timerSeconds === t && styles.optionTextActive]}>
                {t}s
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Button
          label="Générer le Quiz"
          onPress={handleGenerate}
          variant="primary"
          fullWidth
          disabled={!canGenerate}
          style={styles.generateBtn}
        />
      </ScrollView>
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
    fontFamily: Typography.fontDisplay,
    fontSize: Typography.sizeH1,
    color: Colors.textPrimary,
  },
  content: { padding: Spacing.lg, gap: Spacing.md, paddingBottom: Spacing.xxl },
  label: {
    fontFamily: Typography.fontBodyMedium,
    fontSize: Typography.sizeCaption,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: Spacing.sm,
  },
  input: {
    backgroundColor: Colors.bgSurface,
    borderRadius: Radius.button,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    color: Colors.textPrimary,
    fontFamily: Typography.fontBody,
    fontSize: Typography.sizeBody,
  },
  subjectsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  subjectCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.bgSurface,
  },
  subjectCardActive: {
    borderColor: Colors.accentPrimary,
    backgroundColor: 'rgba(240,201,58,0.1)',
  },
  subjectLabel: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.sizeCaption,
    color: Colors.textSecondary,
  },
  subjectLabelActive: { color: Colors.accentPrimary },
  optionsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    flexWrap: 'wrap',
  },
  optionChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.bgSurface,
  },
  optionChipActive: {
    borderColor: Colors.accentPrimary,
    backgroundColor: 'rgba(240,201,58,0.1)',
  },
  optionText: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.sizeBody,
    color: Colors.textSecondary,
  },
  optionTextActive: { color: Colors.accentPrimary },
  elimCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.bgSurface,
    borderRadius: Radius.card,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
  },
  elimCardActive: {
    borderColor: Colors.borderActive,
    backgroundColor: 'rgba(240,201,58,0.06)',
  },
  elimLabel: {
    flex: 1,
    fontFamily: Typography.fontBody,
    fontSize: Typography.sizeBody,
    color: Colors.textSecondary,
  },
  elimLabelActive: { color: Colors.textPrimary },
  generateBtn: { marginTop: Spacing.lg },
});
