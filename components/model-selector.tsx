'use client';

import React from 'react';
import { useChatContext } from '@/hooks/use-chat-context';
import { useSettings } from '@/hooks/use-settings-context';
import { ModelProvider } from '@/lib/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings } from './settings';
import { Lock, AlertCircle } from 'lucide-react';

const providerLabels: Record<ModelProvider, string> = {
  [ModelProvider.OPENAI]: 'OpenAI',
  [ModelProvider.GOOGLE]: 'Google',
  [ModelProvider.ANTHROPIC]: 'Anthropic',
  [ModelProvider.OPENROUTER]: 'OpenRouter',
};

const providerColors: Record<ModelProvider, string> = {
  [ModelProvider.OPENAI]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  [ModelProvider.GOOGLE]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  [ModelProvider.ANTHROPIC]: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  [ModelProvider.OPENROUTER]: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
};

export const ModelSelector: React.FC = () => {
  const {
    selectedProvider,
    selectedModel,
    availableProviders,
    availableModels,
    setSelectedProvider,
    setSelectedModel,
  } = useChatContext();

  const { isProviderEnabled } = useSettings();

  const enabledProviders = availableProviders.filter(provider => isProviderEnabled(provider));

  // If current provider is disabled, switch to first enabled provider
  React.useEffect(() => {
    if (!isProviderEnabled(selectedProvider) && enabledProviders.length > 0) {
      setSelectedProvider(enabledProviders[0]);
    }
  }, [selectedProvider, isProviderEnabled, enabledProviders, setSelectedProvider]);

  return (
    <Card className="w-full max-w-2xl mx-auto mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">AI Model Selection</CardTitle>
          <Settings />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Provider Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">AI Provider</label>
          <Select 
            value={selectedProvider} 
            onValueChange={(value) => setSelectedProvider(value as ModelProvider)}
            disabled={enabledProviders.length === 0}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {availableProviders.map((provider) => {
                const isEnabled = isProviderEnabled(provider);
                return (
                  <SelectItem 
                    key={provider} 
                    value={provider}
                    disabled={!isEnabled}
                    className={!isEnabled ? 'opacity-50 cursor-not-allowed' : ''}
                  >
                    <div className="flex items-center space-x-2">
                      <Badge className={providerColors[provider]}>
                        {providerLabels[provider]}
                      </Badge>
                      {!isEnabled && (
                        <Lock className="w-3 h-3 text-muted-foreground" />
                      )}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          
          {enabledProviders.length === 0 && (
            <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  No AI providers are enabled. Add API keys in settings to get started.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Model Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Model</label>
          <Select 
            value={selectedModel} 
            onValueChange={setSelectedModel}
            disabled={!isProviderEnabled(selectedProvider)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {availableModels.map((model) => (
                <SelectItem key={model.model} value={model.model}>
                  <div className="flex items-center justify-between w-full">
                    <span className="font-medium">{model.name}</span>
                    {model.isFree && (
                      <Badge variant="secondary" className="ml-2">
                        Free
                      </Badge>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Selected Model Info */}
        {selectedModel && isProviderEnabled(selectedProvider) && (
          <div className="p-3 bg-muted rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Selected Model</span>
              <Badge className={providerColors[selectedProvider]}>
                {providerLabels[selectedProvider]}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {availableModels.find(m => m.model === selectedModel)?.description || 'No description available'}
            </p>
          </div>
        )}

        {/* Provider Status */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Provider Status</label>
          <div className="grid grid-cols-2 gap-2">
            {availableProviders.map((provider) => {
              const isEnabled = isProviderEnabled(provider);
              return (
                <div
                  key={provider}
                  className={`p-2 rounded-lg border text-xs flex items-center justify-between ${
                    isEnabled
                      ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800'
                      : 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800'
                  }`}
                >
                  <span className="font-medium">{providerLabels[provider]}</span>
                  <Badge 
                    variant={isEnabled ? 'default' : 'secondary'}
                    className={isEnabled ? 'bg-green-600' : ''}
                  >
                    {isEnabled ? 'Enabled' : 'Disabled'}
                  </Badge>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
