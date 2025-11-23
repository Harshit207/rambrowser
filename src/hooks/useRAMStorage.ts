import { useState, useCallback } from 'react';
import { UserProfile, CookieData } from '../types/profile';

interface RAMStorageState {
  loadedProfile: UserProfile | null;
  isDirty: boolean;
  cookies: CookieData[];
}

export const useRAMStorage = () => {
  const [ramStorage, setRAMStorage] = useState<RAMStorageState>({
    loadedProfile: null,
    isDirty: false,
    cookies: [],
  });

  const loadProfile = useCallback((profile: UserProfile) => {
    setRAMStorage({
      loadedProfile: { ...profile },
      isDirty: false,
      cookies: [...profile.cookies],
    });
  }, []);

  const addCookie = useCallback((cookie: CookieData) => {
    setRAMStorage((prev) => {
      const updatedCookies = prev.cookies.filter((c) => c.name !== cookie.name);
      return {
        ...prev,
        cookies: [...updatedCookies, cookie],
        isDirty: true,
      };
    });
  }, []);

  const removeCookie = useCallback((cookieName: string) => {
    setRAMStorage((prev) => ({
      ...prev,
      cookies: prev.cookies.filter((c) => c.name !== cookieName),
      isDirty: true,
    }));
  }, []);

  const updateSettings = useCallback((settings: Record<string, string | number | boolean>) => {
    setRAMStorage((prev) => {
      if (!prev.loadedProfile) return prev;
      return {
        ...prev,
        loadedProfile: {
          ...prev.loadedProfile,
          settings: { ...prev.loadedProfile.settings, ...settings },
        },
        isDirty: true,
      };
    });
  }, []);

  const getProfileToSave = useCallback((): UserProfile | null => {
    if (!ramStorage.loadedProfile) return null;
    return {
      ...ramStorage.loadedProfile,
      cookies: ramStorage.cookies,
      lastModified: Date.now(),
    };
  }, [ramStorage]);

  const clearRAM = useCallback(() => {
    setRAMStorage({
      loadedProfile: null,
      isDirty: false,
      cookies: [],
    });
  }, []);

  return {
    ...ramStorage,
    loadProfile,
    addCookie,
    removeCookie,
    updateSettings,
    getProfileToSave,
    clearRAM,
  };
};
