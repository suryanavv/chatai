'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { ModelProvider, ModelConfig } from '@/lib/types';
import { getModelsByProvider } from '@/lib/models';
import { useSettings } from './use-settings-context';

interface ChatContextType {
  selectedProvider: ModelProvider;
  selectedModel: string;
  availableProviders: ModelProvider[];
  availableModels: ModelConfig[];
  setSelectedProvider: (provider: ModelProvider) => void;
  setSelectedModel: (model: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const { isProviderEnabled } = useSettings();
  const [selectedProvider, setSelectedProvider] = useState<ModelProvider>(ModelProvider.OPENROUTER);
  const [selectedModel, setSelectedModel] = useState<string>('openai/gpt-oss-20b:free');

  const allProviders = [
    ModelProvider.OPENAI,
    ModelProvider.GOOGLE,
    ModelProvider.ANTHROPIC,
    ModelProvider.OPENROUTER,
  ];

  // Filter to only enabled providers
  const availableProviders = allProviders.filter(provider => isProviderEnabled(provider));
  const availableModels = getModelsByProvider(selectedProvider);

  // Update selected provider if current one becomes disabled
  useEffect(() => {
    if (!isProviderEnabled(selectedProvider) && availableProviders.length > 0) {
      setSelectedProvider(availableProviders[0]);
    }
  }, [selectedProvider, isProviderEnabled, availableProviders]);

  // Update selected model when provider changes
  useEffect(() => {
    if (availableModels.length > 0) {
      setSelectedModel(availableModels[0].model);
    }
  }, [selectedProvider, availableModels]);

  const handleProviderChange = (provider: ModelProvider) => {
    if (isProviderEnabled(provider)) {
      setSelectedProvider(provider);
      const models = getModelsByProvider(provider);
      if (models.length > 0) {
        setSelectedModel(models[0].model);
      }
    }
  };

  const value: ChatContextType = {
    selectedProvider,
    selectedModel,
    availableProviders,
    availableModels,
    setSelectedProvider: handleProviderChange,
    setSelectedModel,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};
