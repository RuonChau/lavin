'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '@/shared/lib/axios';
import { unwrapData } from '@/shared/lib/api-response';

type SettingsImage = {
  uid?: string;
  name?: string;
  url?: string;
  secure_url?: string;
  public_id?: string;
};

type PublicAppearanceSettings = {
  themeMode?: 'light' | 'dark' | 'system';
  primaryColor?: string;
  borderRadius?: number;
  density?: 'compact' | 'comfortable' | 'spacious';
  animationEnabled?: boolean;
};

export type PublicSettings = {
  brandName: string;
  description: string;
  logo: SettingsImage[];
  contactEmail?: string;
  phone?: string;
  website?: string;
  appearance?: PublicAppearanceSettings;
};

type PublicSettingsContextValue = {
  settings: PublicSettings;
  logoUrl?: string;
  isLoading: boolean;
};

const fallbackSettings: PublicSettings = {
  brandName: 'LaVin ERP',
  description: 'ERP dashboard for cafe chain operations.',
  logo: [],
  appearance: {
    themeMode: 'light',
    primaryColor: '#8B5E3C',
    borderRadius: 16,
    density: 'comfortable',
    animationEnabled: true,
  },
};

const PublicSettingsContext = createContext<PublicSettingsContextValue>({
  settings: fallbackSettings,
  isLoading: true,
});

const clamp = (value: number) => Math.max(0, Math.min(255, Math.round(value)));

const parseHexColor = (hex: string) => {
  const normalized = hex.replace('#', '').trim();
  const value = normalized.length === 3
    ? normalized.split('').map((char) => `${char}${char}`).join('')
    : normalized;

  if (!/^[0-9a-fA-F]{6}$/.test(value)) return null;

  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16),
  };
};

const toHex = (r: number, g: number, b: number) =>
  `#${[r, g, b].map((channel) => clamp(channel).toString(16).padStart(2, '0')).join('')}`;

const mixColor = (source: string, target: string, weight: number) => {
  const sourceRgb = parseHexColor(source);
  const targetRgb = parseHexColor(target);

  if (!sourceRgb || !targetRgb) return source;

  return toHex(
    sourceRgb.r * (1 - weight) + targetRgb.r * weight,
    sourceRgb.g * (1 - weight) + targetRgb.g * weight,
    sourceRgb.b * (1 - weight) + targetRgb.b * weight,
  );
};

const getLogoUrl = (logo: SettingsImage[] = []) => {
  const firstLogo = logo[0];
  return firstLogo?.url || firstLogo?.secure_url;
};

const applyAppearanceSettings = (appearance?: PublicAppearanceSettings) => {
  if (typeof document === 'undefined') return;

  const primaryColor = appearance?.primaryColor || fallbackSettings.appearance?.primaryColor || '#8B5E3C';
  const root = document.documentElement;

  root.style.setProperty('--color-primary', primaryColor);
  root.style.setProperty('--color-primary-deep', mixColor(primaryColor, '#000000', 0.34));
  root.style.setProperty('--color-primary-soft', mixColor(primaryColor, '#ffffff', 0.58));

  if (appearance?.borderRadius) {
    const baseRadius = appearance.borderRadius;
    root.style.setProperty('--radius-xl', `${baseRadius}px`);
    root.style.setProperty('--radius-2xl', `${baseRadius + 4}px`);
    root.style.setProperty('--radius-3xl', `${baseRadius + 8}px`);
    root.style.setProperty('--radius-4xl', `${baseRadius + 16}px`);
  }

  root.dataset.themeMode = appearance?.themeMode || 'light';
  root.dataset.density = appearance?.density || 'comfortable';
  root.dataset.animation = appearance?.animationEnabled === false ? 'off' : 'on';
};

export function PublicSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<PublicSettings>(fallbackSettings);
  const [isLoading, setIsLoading] = useState(true);

  const loadSettings = useCallback(async () => {
    try {
      const response = await api.get('/settings/public');
      const payload = unwrapData<PublicSettings>(response.data);

      const nextSettings = {
        ...fallbackSettings,
        ...payload,
        logo: Array.isArray(payload.logo) ? payload.logo : [],
        appearance: {
          ...fallbackSettings.appearance,
          ...(payload.appearance ?? {}),
        },
      };

      setSettings(nextSettings);
      applyAppearanceSettings(nextSettings.appearance);
    } catch (error) {
      console.warn('Unable to load public system settings:', error);
      applyAppearanceSettings(fallbackSettings.appearance);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();

    window.addEventListener('public-settings:refresh', loadSettings);

    return () => {
      window.removeEventListener('public-settings:refresh', loadSettings);
    };
  }, [loadSettings]);

  const value = useMemo(
    () => ({
      settings,
      logoUrl: getLogoUrl(settings.logo),
      isLoading,
    }),
    [settings, isLoading],
  );

  return (
    <PublicSettingsContext.Provider value={value}>
      {children}
    </PublicSettingsContext.Provider>
  );
}

export const usePublicSettings = () => useContext(PublicSettingsContext);
