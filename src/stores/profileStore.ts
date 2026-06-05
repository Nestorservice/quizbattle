import { create } from 'zustand';
import { Profile } from '../types/profile';
import { storageGet, storageSet, storageDelete, STORAGE_KEYS } from '../utils/storage';

interface ProfileStore {
  profile: Profile | null;
  isOnboarded: boolean;
  setProfile: (p: Profile) => void;
  updateProfile: (partial: Partial<Profile>) => void;
  clearProfile: () => void;
  loadFromStorage: () => void;
}

export const useProfileStore = create<ProfileStore>((set, get) => ({
  profile: null,
  isOnboarded: false,

  loadFromStorage: () => {
    const profile = storageGet<Profile>(STORAGE_KEYS.PROFILE);
    const isOnboarded = storageGet<boolean>(STORAGE_KEYS.IS_ONBOARDED) ?? false;
    set({ profile, isOnboarded });
  },

  setProfile: (p: Profile) => {
    storageSet(STORAGE_KEYS.PROFILE, p);
    storageSet(STORAGE_KEYS.IS_ONBOARDED, true);
    set({ profile: p, isOnboarded: true });
  },

  updateProfile: (partial: Partial<Profile>) => {
    const current = get().profile;
    if (!current) return;
    const updated = { ...current, ...partial };
    storageSet(STORAGE_KEYS.PROFILE, updated);
    set({ profile: updated });
  },

  clearProfile: () => {
    storageDelete(STORAGE_KEYS.PROFILE);
    storageDelete(STORAGE_KEYS.IS_ONBOARDED);
    set({ profile: null, isOnboarded: false });
  },
}));
