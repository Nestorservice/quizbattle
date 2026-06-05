interface MMKVStorage {
  set(key: string, value: string): void;
  getString(key: string): string | undefined;
  delete(key: string): void;
  contains(key: string): boolean;
}

// react-native-mmkv v4 (Nitro Modules) exporte MMKV comme interface, pas classe
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { MMKV: MMKVConstructor } = require('react-native-mmkv') as {
  MMKV: new (config?: { id?: string; encryptionKey?: string }) => MMKVStorage;
};

export const storage: MMKVStorage = new MMKVConstructor({ id: 'quizbattle' });

export function storageGet<T>(key: string): T | null {
  const raw = storage.getString(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function storageSet<T>(key: string, value: T): void {
  storage.set(key, JSON.stringify(value));
}

export function storageDelete(key: string): void {
  storage.delete(key);
}

export const STORAGE_KEYS = {
  PROFILE: 'profile',
  IS_ONBOARDED: 'is_onboarded',
  HISTORY: 'history',
  DEVICE_ID: 'device_id',
  SUPABASE_SESSION: 'supabase_session',
};
