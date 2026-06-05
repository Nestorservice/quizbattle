import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTeamsStore } from '../../stores/teamsStore';
import { Team } from '../../types/team';
import { Button } from '../ui/Button';
import { Colors, Typography, Spacing, Radius } from '../../constants/theme';
import { TEAM_COLORS, TEAM_ICONS } from '../../constants/subjects';

interface CreateTeamSheetProps {
  visible: boolean;
  onClose: () => void;
}

export const CreateTeamSheet: React.FC<CreateTeamSheetProps> = ({ visible, onClose }) => {
  const { addTeam } = useTeamsStore();
  const [name, setName] = useState('');
  const [color, setColor] = useState(TEAM_COLORS[0]);
  const [icon, setIcon] = useState(TEAM_ICONS[0]);
  const [memberInput, setMemberInput] = useState('');
  const [members, setMembers] = useState<string[]>([]);

  const reset = () => {
    setName('');
    setColor(TEAM_COLORS[0]);
    setIcon(TEAM_ICONS[0]);
    setMemberInput('');
    setMembers([]);
  };

  const addMember = () => {
    const trimmed = memberInput.trim();
    if (trimmed && !members.includes(trimmed)) {
      setMembers(prev => [...prev, trimmed]);
      setMemberInput('');
    }
  };

  const removeMember = (m: string) => {
    setMembers(prev => prev.filter(x => x !== m));
  };

  const handleCreate = () => {
    if (!name.trim()) return;
    const team: Team = {
      id: `team_${Date.now()}`,
      name: name.trim(),
      color,
      icon,
      members,
    };
    addTeam(team);
    reset();
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.sheet}>
        <View style={styles.handle} />
        <Text style={styles.title}>Créer une équipe</Text>

        <ScrollView showsVerticalScrollIndicator={false}>
          <TextInput
            style={styles.input}
            placeholder="Nom de l'équipe"
            placeholderTextColor={Colors.textTertiary}
            value={name}
            onChangeText={setName}
            maxLength={20}
          />

          <Text style={styles.label}>Couleur</Text>
          <View style={styles.colorRow}>
            {TEAM_COLORS.map(c => (
              <TouchableOpacity
                key={c}
                style={[
                  styles.colorDot,
                  { backgroundColor: c },
                  color === c && styles.colorDotActive,
                ]}
                onPress={() => setColor(c)}
              />
            ))}
          </View>

          <Text style={styles.label}>Icône</Text>
          <View style={styles.iconGrid}>
            {TEAM_ICONS.map(ic => (
              <TouchableOpacity
                key={ic}
                style={[styles.iconBtn, icon === ic && styles.iconBtnActive]}
                onPress={() => setIcon(ic)}>
                <Icon name={ic} size={20} color={icon === ic ? Colors.accentPrimary : Colors.textSecondary} />
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Membres</Text>
          <View style={styles.memberInputRow}>
            <TextInput
              style={[styles.input, styles.memberInput]}
              placeholder="Prénom + Entrée"
              placeholderTextColor={Colors.textTertiary}
              value={memberInput}
              onChangeText={setMemberInput}
              onSubmitEditing={addMember}
              returnKeyType="done"
            />
            <TouchableOpacity style={styles.addMemberBtn} onPress={addMember}>
              <Icon name="plus" size={20} color={Colors.accentPrimary} />
            </TouchableOpacity>
          </View>
          <View style={styles.tagsRow}>
            {members.map(m => (
              <TouchableOpacity key={m} style={styles.tag} onPress={() => removeMember(m)}>
                <Text style={styles.tagText}>{m}</Text>
                <Icon name="close" size={12} color={Colors.textSecondary} />
              </TouchableOpacity>
            ))}
          </View>

          <Button
            label="Créer l'équipe"
            onPress={handleCreate}
            variant="primary"
            fullWidth
            disabled={!name.trim()}
            style={styles.createBtn}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    backgroundColor: Colors.bgSurface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
    maxHeight: '80%',
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    fontFamily: Typography.fontDisplay,
    fontSize: Typography.sizeH2,
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
  },
  label: {
    fontFamily: Typography.fontBodyMedium,
    fontSize: Typography.sizeCaption,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.sm,
    marginTop: Spacing.md,
  },
  input: {
    backgroundColor: Colors.bgSurface2,
    borderRadius: Radius.button,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    color: Colors.textPrimary,
    fontFamily: Typography.fontBody,
    fontSize: Typography.sizeBody,
  },
  colorRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    flexWrap: 'wrap',
  },
  colorDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  colorDotActive: {
    borderWidth: 3,
    borderColor: Colors.textPrimary,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: Colors.bgSurface2,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnActive: {
    borderColor: Colors.accentPrimary,
    backgroundColor: 'rgba(240,201,58,0.1)',
  },
  memberInputRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'center',
  },
  memberInput: {
    flex: 1,
  },
  addMemberBtn: {
    width: 48,
    height: 48,
    borderRadius: Radius.button,
    backgroundColor: Colors.bgSurface2,
    borderWidth: 1,
    borderColor: Colors.accentPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.bgSurface3,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
  },
  tagText: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.sizeCaption,
    color: Colors.textSecondary,
  },
  createBtn: {
    marginTop: Spacing.lg,
  },
});
