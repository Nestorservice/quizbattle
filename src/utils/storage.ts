import { createMMKV } from 'react-native-mmkv';

export const storage = createMMKV({ id: 'quizbattle' });

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
  storage.remove(key);
}

export const STORAGE_KEYS = {
  PROFILE: 'profile',
  IS_ONBOARDED: 'is_onboarded',
  HISTORY: 'history',
  DEVICE_ID: 'device_id',
  SUPABASE_SESSION: 'supabase_session',
};
