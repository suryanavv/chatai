'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { ModelProvider } from '@/lib/types';

interface APIKeys {
  [ModelProvider.OPENAI]: string;
  [ModelProvider.GOOGLE]: string;
  [ModelProvider.ANTHROPIC]: string;
  [ModelProvider.OPENROUTER]: string;
}

interface SettingsContextType {
  apiKeys: APIKeys;
  setAPIKey: (provider: ModelProvider, key: string) => void;
  hasAPIKey: (provider: ModelProvider) => boolean;
  clearAPIKey: (provider: ModelProvider) => void;
  isProviderEnabled: (provider: ModelProvider) => boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [apiKeys, setApiKeys] = useState<APIKeys>({
    [ModelProvider.OPENAI]: '',
    [ModelProvider.GOOGLE]: '',
    [ModelProvider.ANTHROPIC]: '',
    [ModelProvider.OPENROUTER]: '',
  });

  // Load API keys from localStorage on mount
  useEffect(() => {
    const savedKeys = localStorage.getItem('ai-chat-api-keys');
    if (savedKeys) {
      try {
        const parsed = JSON.parse(savedKeys);
        setApiKeys(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Failed to parse saved API keys:', error);
      }
    }
  }, []);

  // Save API keys to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('ai-chat-api-keys', JSON.stringify(apiKeys));
  }, [apiKeys]);

  const setAPIKey = (provider: ModelProvider, key: string) => {
    setApiKeys(prev => ({
      ...prev,
      [provider]: key,
    }));
  };

  const hasAPIKey = (provider: ModelProvider): boolean => {
    return !!apiKeys[provider] && apiKeys[provider].trim().length > 0;
  };

  const clearAPIKey = (provider: ModelProvider) => {
    setApiKeys(prev => ({
      ...prev,
      [provider]: '',
    }));
  };

  const isProviderEnabled = (provider: ModelProvider): boolean => {
    return hasAPIKey(provider);
  };

  const value: SettingsContextType = {
    apiKeys,
    setAPIKey,
    hasAPIKey,
    clearAPIKey,
    isProviderEnabled,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
