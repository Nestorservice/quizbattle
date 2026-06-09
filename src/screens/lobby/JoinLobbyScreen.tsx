import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { GameStackParamList } from '../../navigation/types';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { EmptyState } from '../../components/ui/EmptyState';
import { Colors, Typography, Spacing, Radius } from '../../constants/theme';
import { BleDevice } from '../../types/ble';

type Nav = StackNavigationProp<GameStackParamList, 'JoinLobby'>;

export const JoinLobbyScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const [scanning, setScanning] = useState(true);
  const [devices] = useState<BleDevice[]>([]);

  useEffect(() => {
    // BLE scan sera intégré Phase 8
    const timer = setTimeout(() => setScanning(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const connectToDevice = (_device: BleDevice) => {
    navigation.navigate('WaitingRoom');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-left" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Rejoindre</Text>
        {scanning && <LoadingSpinner size="small" style={styles.scanIndicator} />}
      </View>

      <Text style={styles.subtitle}>
        {scanning ? 'Recherche de parties Bluetooth...' : `${devices.length} partie(s) trouvée(s)`}
      </Text>

      <FlatList
        data={devices}
        keyExtractor={d => d.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          !scanning ? (
            <EmptyState
              icon="bluetooth-off"
              title="Aucune partie trouvée"
              subtitle="Assure-toi que le Bluetooth est activé et qu'une partie est en cours"
            />
          ) : null
        }
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInDown.delay(index * 80)}>
            <TouchableOpacity style={styles.deviceCard} onPress={() => connectToDevice(item)}>
              <Icon name="bluetooth" size={22} color={Colors.accentSecondary} />
              <View style={styles.deviceInfo}>
                <Text style={styles.deviceName}>{item.name}</Text>
                <Text style={styles.deviceRssi}>Signal : {item.rssi} dBm</Text>
              </View>
              <Icon name="chevron-right" size={20} color={Colors.textTertiary} />
            </TouchableOpacity>
          </Animated.View>
        )}
      />
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
  scanIndicator: { padding: 0 },
  subtitle: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.sizeBody,
    color: Colors.textSecondary,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  list: { padding: Spacing.lg, gap: Spacing.sm },
  deviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgSurface,
    borderRadius: Radius.card,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    gap: Spacing.md,
  },
  deviceInfo: { flex: 1 },
  deviceName: {
    fontFamily: Typography.fontBodyMedium,
    fontSize: Typography.sizeH3,
    color: Colors.textPrimary,
  },
  deviceRssi: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.sizeCaption,
    color: Colors.textSecondary,
  },
});
