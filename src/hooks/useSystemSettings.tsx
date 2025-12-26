import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { SystemSettings } from '@/types';

interface SystemSettingsContextType {
  settings: SystemSettings;
  updateSettings: (newSettings: Partial<SystemSettings>) => void;
  isElectionOpen: boolean;
  isVotingEnabled: boolean;
  isRegistrationEnabled: boolean;
}

const SystemSettingsContext = createContext<SystemSettingsContextType | undefined>(undefined);

export function SystemSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SystemSettings>(() => {
    // Load from localStorage on initialization
    const stored = localStorage.getItem('system_settings');
    if (stored) {
      try {
        return JSON.parse(stored);
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
        const firestoreSettings = settingsDoc.data() as SystemSettings;
        setSettings(firestoreSettings);
      }
    } catch (error) {
      console.error('Error loading settings from Firestore:', error);
    }
  };

  const updateSettings = async (newSettings: Partial<SystemSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    
    // Business rule: voting and registration can't be enabled simultaneously
    if (updatedSettings.votingEnabled && updatedSettings.registrationEnabled) {
      if (newSettings.votingEnabled) {
        updatedSettings.registrationEnabled = false;
      } else if (newSettings.registrationEnabled) {
        updatedSettings.votingEnabled = false;
      }
    }
    
    setSettings(updatedSettings);
    
    // Save to Firestore
    try {
      await setDoc(doc(db, 'settings', 'system'), updatedSettings);
    } catch (error) {
      console.error('Error saving settings to Firestore:', error);
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