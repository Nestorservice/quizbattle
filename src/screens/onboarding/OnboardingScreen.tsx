import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';
import { useProfileStore } from '../../stores/profileStore';
import { Button } from '../../components/ui/Button';
import { Colors, Typography, Spacing, Radius } from '../../constants/theme';
import { SUBJECTS } from '../../constants/subjects';
import { Profile, Level } from '../../types/profile';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type Nav = StackNavigationProp<RootStackParamList, 'Onboarding'>;

const AGE_RANGES = ['< 15 ans', '15-20 ans', '21-30 ans', '31-45 ans', '46-60 ans', '60+ ans'];
const LEVELS: { id: Level; label: string; desc: string; icon: string }[] = [
  { id: 'beginner', label: 'Débutant', desc: 'Je commence', icon: 'sprout' },
  { id: 'intermediate', label: 'Intermédiaire', desc: 'J\'ai quelques bases', icon: 'fire' },
  { id: 'expert', label: 'Expert', desc: 'Je maîtrise', icon: 'crown' },
];

export const OnboardingScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const { setProfile } = useProfileStore();
  const flatListRef = useRef<FlatList>(null);
  const [currentPage, setCurrentPage] = useState(0);

  const [pseudo, setPseudo] = useState('');
  const [ageRange, setAgeRange] = useState('');
  const [level, setLevel] = useState<Level>('intermediate');
  const [interests, setInterests] = useState<string[]>([]);
  const [bio, setBio] = useState('');

  const buttonScale = useSharedValue(1);
  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const canGoNext = () => {
    if (currentPage === 0) return pseudo.trim().length >= 2 && ageRange !== '';
    if (currentPage === 1) return true;
    if (currentPage === 2) return interests.length >= 1;
    return false;
  };

  const goNext = () => {
    if (!canGoNext()) return;
    if (currentPage < 2) {
      const next = currentPage + 1;
      setCurrentPage(next);
      flatListRef.current?.scrollToIndex({ index: next, animated: true });
    } else {
      const profile: Profile = {
        id: `${Date.now()}`,
        pseudo: pseudo.trim(),
        ageRange,
        level,
        interests,
        bio: bio.trim(),
        deviceId: `device_${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      setProfile(profile);
      navigation.replace('Main', { screen: 'Home' });
    }
  };

  const toggleInterest = (id: string) => {
    setInterests(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id],
    );
  };

  const pages = [
    // Page 1 : Pseudo + Âge
    <KeyboardAvoidingView key="p1" behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.page}>
      <Text style={styles.pageTitle}>Comment t'appelle-t-on ?</Text>
      <Text style={styles.pageSubtitle}>Ton pseudo apparaîtra pendant les parties</Text>
      <TextInput
        style={[styles.input, pseudo.trim().length < 2 && pseudo.length > 0 && styles.inputError]}
        placeholder="Ton pseudo"
        placeholderTextColor={Colors.textTertiary}
        value={pseudo}
        onChangeText={setPseudo}
        maxLength={20}
        autoCapitalize="words"
      />
      <Text style={styles.sectionLabel}>Ton groupe d'âge</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.ageRow}>
        {AGE_RANGES.map(age => (
          <TouchableOpacity
            key={age}
            style={[styles.ageChip, ageRange === age && styles.ageChipActive]}
            onPress={() => setAgeRange(age)}>
            <Text style={[styles.ageChipText, ageRange === age && styles.ageChipTextActive]}>
              {age}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </KeyboardAvoidingView>,

    // Page 2 : Niveau
    <View key="p2" style={styles.page}>
      <Text style={styles.pageTitle}>Ton niveau</Text>
      <Text style={styles.pageSubtitle}>L'IA adaptera la difficulté des questions</Text>
      <View style={styles.levelContainer}>
        {LEVELS.map(l => (
          <TouchableOpacity
            key={l.id}
            style={[styles.levelCard, level === l.id && styles.levelCardActive]}
            onPress={() => setLevel(l.id)}>
            <Icon name={l.icon} size={28} color={level === l.id ? Colors.accentPrimary : Colors.textSecondary} />
            <Text style={[styles.levelLabel, level === l.id && styles.levelLabelActive]}>{l.label}</Text>
            <Text style={styles.levelDesc}>{l.desc}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>,

    // Page 3 : Intérêts + Bio
    <ScrollView key="p3" style={styles.page} showsVerticalScrollIndicator={false}>
      <Text style={styles.pageTitle}>Tes domaines</Text>
      <Text style={styles.pageSubtitle}>Choisis au moins 1 domaine d'intérêt</Text>
      <View style={styles.interestsGrid}>
        {SUBJECTS.map(s => (
          <TouchableOpacity
            key={s.id}
            style={[styles.interestChip, interests.includes(s.id) && styles.interestChipActive]}
            onPress={() => toggleInterest(s.id)}>
            <Icon name={s.icon} size={16} color={interests.includes(s.id) ? Colors.accentPrimary : Colors.textSecondary} />
            <Text style={[styles.interestText, interests.includes(s.id) && styles.interestTextActive]}>
              {s.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.sectionLabel}>Bio (optionnel)</Text>
      <TextInput
        style={[styles.input, styles.bioInput]}
        placeholder="Quelques mots sur toi..."
        placeholderTextColor={Colors.textTertiary}
        value={bio}
        onChangeText={setBio}
        multiline
        maxLength={150}
      />
    </ScrollView>,
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>QuizBattle</Text>
        <View style={styles.dots}>
          {[0, 1, 2].map(i => (
            <View key={i} style={[styles.dot, i === currentPage && styles.dotActive]} />
          ))}
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        data={pages}
        renderItem={({ item }) => <View style={{ width: SCREEN_WIDTH }}>{item}</View>}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, i) => String(i)}
      />

      <View style={styles.footer}>
        <Animated.View style={[styles.nextButton, buttonStyle]}>
          <Button
            label={currentPage === 2 ? 'Commencer' : 'Suivant'}
            onPress={goNext}
            variant="primary"
            fullWidth
            disabled={!canGoNext()}
          />
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
  },
  header: {
    paddingTop: 56,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    alignItems: 'center',
    gap: Spacing.md,
  },
  headerTitle: {
    fontFamily: Typography.fontDisplay,
    fontSize: Typography.sizeH2,
    color: Colors.accentPrimary,
  },
  dots: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.bgSurface3,
  },
  dotActive: {
    backgroundColor: Colors.accentPrimary,
    width: 24,
  },
  page: {
    width: SCREEN_WIDTH,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    flex: 1,
  },
  pageTitle: {
    fontFamily: Typography.fontDisplay,
    fontSize: Typography.sizeH1,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  pageSubtitle: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.sizeBody,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
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
    marginBottom: Spacing.md,
  },
  inputError: {
    borderColor: Colors.accentDanger,
  },
  bioInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  sectionLabel: {
    fontFamily: Typography.fontBodyMedium,
    fontSize: Typography.sizeCaption,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.sm,
  },
  ageRow: {
    flexDirection: 'row',
  },
  ageChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: Spacing.sm,
    backgroundColor: Colors.bgSurface,
  },
  ageChipActive: {
    borderColor: Colors.accentPrimary,
    backgroundColor: 'rgba(240,201,58,0.1)',
  },
  ageChipText: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.sizeBody,
    color: Colors.textSecondary,
  },
  ageChipTextActive: {
    color: Colors.accentPrimary,
  },
  levelContainer: {
    gap: Spacing.md,
    marginTop: Spacing.sm,
  },
  levelCard: {
    backgroundColor: Colors.bgSurface,
    borderRadius: Radius.card,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.lg,
    alignItems: 'center',
    gap: Spacing.xs,
  },
  levelCardActive: {
    borderColor: Colors.borderActive,
    backgroundColor: 'rgba(240,201,58,0.06)',
  },
  levelLabel: {
    fontFamily: Typography.fontBodyMedium,
    fontSize: Typography.sizeH3,
    color: Colors.textSecondary,
  },
  levelLabelActive: {
    color: Colors.accentPrimary,
  },
  levelDesc: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.sizeCaption,
    color: Colors.textTertiary,
  },
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  interestChip: {
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
  interestChipActive: {
    borderColor: Colors.accentPrimary,
    backgroundColor: 'rgba(240,201,58,0.1)',
  },
  interestText: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.sizeCaption,
    color: Colors.textSecondary,
  },
  interestTextActive: {
    color: Colors.accentPrimary,
  },
  footer: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  nextButton: {
    width: '100%',
  },
});
