import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { SystemSettings } from '@/types';

interface SystemSettingsContextType {
  settings: SystemSettings;
  updateSettings: (newSettings: Partial<SystemSettings>) => Promise<void>;
  isElectionOpen: boolean;
  isVotingEnabled: boolean;
  isRegistrationEnabled: boolean;
}

const SystemSettingsContext = createContext<SystemSettingsContextType | undefined>(undefined);

function normalizeSystemSettings(raw: any): SystemSettings {
  const normalized: SystemSettings = {
    votingEnabled: raw?.votingEnabled ?? raw?.voting_enabled ?? false,
    registrationEnabled: raw?.registrationEnabled ?? raw?.registration_enabled ?? true,
    electionOpen: raw?.electionOpen ?? raw?.election_open ?? false,
    maintenanceMode: raw?.maintenanceMode ?? raw?.maintenance_mode ?? false,
    telegramBotToken: raw?.telegramBotToken ?? raw?.telegram_bot_token ?? '',
    telegramChannelId: raw?.telegramChannelId ?? raw?.telegram_channel_id ?? '',
    telegramEnabled: raw?.telegramEnabled ?? raw?.telegram_enabled ?? false,
    homeHeroTitle: raw?.homeHeroTitle ?? raw?.home_hero_title ?? 'Integrity and Transparency',
    homeHeroSubtitle: raw?.homeHeroSubtitle ?? raw?.home_hero_subtitle ?? 'The Official Ethics and Anti-Corruption Club of Haramaya University',
  };

  if (normalized.votingEnabled && normalized.registrationEnabled) {
    normalized.votingEnabled = false;
  }

  return normalized;
}

export function SystemSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SystemSettings>(() => {
    // Load from localStorage on initialization
    const stored = localStorage.getItem('system_settings');
    if (stored) {
      try {
        return normalizeSystemSettings(JSON.parse(stored));
      } catch (e) {
        console.error('Error parsing stored settings:', e);
      }
    }
    return {
      votingEnabled: false,
      registrationEnabled: true,
      electionOpen: false,
      maintenanceMode: false,
    };
  });

  // Load settings from Firestore on mount
  useEffect(() => {
    loadSettingsFromFirestore();
  }, []);

  // Persist to localStorage whenever settings change
  useEffect(() => {
    localStorage.setItem('system_settings', JSON.stringify(settings));
  }, [settings]);

  const loadSettingsFromFirestore = async () => {
    try {
      const settingsDoc = await getDoc(doc(db, 'settings', 'system'));
      if (settingsDoc.exists()) {
        setSettings(normalizeSystemSettings(settingsDoc.data()));
      }
    } catch (error) {
      console.error('Error loading settings from Firestore:', error);
    }
  };

  const updateSettings = async (newSettings: Partial<SystemSettings>): Promise<void> => {
    const updatedSettings = { ...settings, ...newSettings };

    if (updatedSettings.votingEnabled && updatedSettings.registrationEnabled) {
      throw new Error('Voting and registration cannot be enabled at the same time.');
    }
    
    setSettings(updatedSettings);
    
    // Save to Firestore
    try {
      await setDoc(doc(db, 'settings', 'system'), updatedSettings);
    } catch (error) {
      console.error('Error saving settings to Firestore:', error);
      throw error;
    }
  };

  return (
    <SystemSettingsContext.Provider value={{
      settings,
      updateSettings,
      isElectionOpen: settings.electionOpen,
      isVotingEnabled: settings.votingEnabled,
      isRegistrationEnabled: settings.registrationEnabled,
    }}>
      {children}
    </SystemSettingsContext.Provider>
  );
}

export function useSystemSettings() {
  const context = useContext(SystemSettingsContext);
  if (context === undefined) {
    throw new Error('useSystemSettings must be used within a SystemSettingsProvider');
  }
  return context;
}