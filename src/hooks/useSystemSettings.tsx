import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SystemSettings {
  voting_enabled: boolean;
  registration_enabled: boolean;
  election_open: boolean;
  maintenance_mode: boolean;
}

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
      voting_enabled: false,
      registration_enabled: true,
      election_open: false,
      maintenance_mode: false,
    };
  });

  // Persist to localStorage whenever settings change
  useEffect(() => {
    localStorage.setItem('system_settings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings: Partial<SystemSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      
      // Business rule: voting and registration can't be enabled simultaneously
      if (updated.voting_enabled && updated.registration_enabled) {
        if (newSettings.voting_enabled) {
          updated.registration_enabled = false;
        } else if (newSettings.registration_enabled) {
          updated.voting_enabled = false;
        }
      }
      
      return updated;
    });
  };

  return (
    <SystemSettingsContext.Provider value={{
      settings,
      updateSettings,
      isElectionOpen: settings.election_open,
      isVotingEnabled: settings.voting_enabled,
      isRegistrationEnabled: settings.registration_enabled,
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