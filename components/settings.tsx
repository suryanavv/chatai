'use client';

import React, { useState } from 'react';
import { useSettings } from '@/hooks/use-settings-context';
import { ModelProvider } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff, Key, Trash2, CheckCircle, AlertCircle, Save, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const providerInfo = {
  [ModelProvider.OPENAI]: {
    name: 'OpenAI',
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    description: 'GPT-4, GPT-3.5, and other OpenAI models',
    helpUrl: 'https://platform.openai.com/api-keys',
  },
  [ModelProvider.GOOGLE]: {
    name: 'Google Gemini',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    description: 'Gemini 2.0, Gemini 1.5, and other Google models',
    helpUrl: 'https://makersuite.google.com/app/apikey',
  },
  [ModelProvider.ANTHROPIC]: {
    name: 'Anthropic Claude',
    color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    description: 'Claude 3.5, Claude 3, and other Anthropic models',
    helpUrl: 'https://console.anthropic.com/',
  },
  [ModelProvider.OPENROUTER]: {
    name: 'OpenRouter',
    color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    description: 'Access to 100+ open source models',
    helpUrl: 'https://openrouter.ai/keys',
  },
};

export const Settings: React.FC<{ open?: boolean; onOpenChange?: (open: boolean) => void }> = ({ open, onOpenChange }) => {
  const { apiKeys, setAPIKey, hasAPIKey, clearAPIKey, isProviderEnabled } = useSettings();
  const [showKeys, setShowKeys] = useState<Record<ModelProvider, boolean>>({
    [ModelProvider.OPENAI]: false,
    [ModelProvider.GOOGLE]: false,
    [ModelProvider.ANTHROPIC]: false,
    [ModelProvider.OPENROUTER]: false,
  });
  const [tempKeys, setTempKeys] = useState<Record<ModelProvider, string>>({
    [ModelProvider.OPENAI]: '',
    [ModelProvider.GOOGLE]: '',
    [ModelProvider.ANTHROPIC]: '',
    [ModelProvider.OPENROUTER]: '',
  });
  const [saving, setSaving] = useState<Record<ModelProvider, boolean>>({
    [ModelProvider.OPENAI]: false,
    [ModelProvider.GOOGLE]: false,
    [ModelProvider.ANTHROPIC]: false,
    [ModelProvider.OPENROUTER]: false,
  });

  // Initialize temp keys with current API keys
  React.useEffect(() => {
    setTempKeys(apiKeys);
  }, [apiKeys]);

  const toggleKeyVisibility = (provider: ModelProvider) => {
    setShowKeys(prev => ({
      ...prev,
      [provider]: !prev[provider],
    }));
  };

  const handleTempKeyChange = (provider: ModelProvider, value: string) => {
    setTempKeys(prev => ({
      ...prev,
      [provider]: value,
    }));
  };

  const handleSaveAPIKey = async (provider: ModelProvider) => {
    setSaving(prev => ({ ...prev, [provider]: true }));
    
    try {
      // Simulate a small delay to show saving state
      await new Promise(resolve => setTimeout(resolve, 500));
      setAPIKey(provider, tempKeys[provider]);
      
      // Show success message
      alert(`${providerInfo[provider].name} API key saved successfully!`);
      
      // Force a page refresh to ensure the chat component picks up the new API key
      window.location.reload();
      
    } catch (error) {
      console.error('Error saving API key:', error);
      alert('Failed to save API key. Please try again.');
    } finally {
      setSaving(prev => ({ ...prev, [provider]: false }));
    }
  };

  const handleClearAPIKey = (provider: ModelProvider) => {
    clearAPIKey(provider);
    setTempKeys(prev => ({ ...prev, [provider]: '' }));
  };

  const hasUnsavedChanges = (provider: ModelProvider) => {
    return tempKeys[provider] !== apiKeys[provider];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>API Key Settings</DialogTitle>
          <DialogDescription>
            Add your API keys to enable different AI providers. Your keys are stored locally and never sent to our servers.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {Object.values(ModelProvider).map((provider) => {
            const info = providerInfo[provider];
            const hasKey = hasAPIKey(provider);
            const isEnabled = isProviderEnabled(provider);
            const unsavedChanges = hasUnsavedChanges(provider);
            const isSaving = saving[provider];
            
            return (
              <Card key={provider} className={`${!isEnabled ? 'opacity-60' : ''}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge className={info.color}>
                        {info.name}
                      </Badge>
                      {hasKey ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-amber-600" />
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      {hasKey && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleKeyVisibility(provider)}
                          className="h-8 w-8 p-0"
                        >
                          {showKeys[provider] ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                      )}
                      {hasKey && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleClearAPIKey(provider)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{info.description}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">API Key</label>
                      <Button
                        variant="link"
                        size="sm"
                        className="h-auto p-0 text-xs"
                        onClick={() => window.open(info.helpUrl, '_blank')}
                      >
                        Get API Key
                      </Button>
                    </div>
                    <div className="flex space-x-2">
                      <Input
                        type={showKeys[provider] ? 'text' : 'password'}
                        placeholder={hasKey ? '••••••••••••••••' : 'Enter your API key'}
                        value={tempKeys[provider]}
                        onChange={(e) => handleTempKeyChange(provider, e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        onClick={() => handleSaveAPIKey(provider)}
                        disabled={!unsavedChanges || isSaving}
                        size="sm"
                        className="px-3"
                      >
                        {isSaving ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Save className="w-4 h-4" />
                        )}
                        {isSaving ? 'Saving...' : 'Save'}
                      </Button>
                    </div>
                  </div>
                  
                  {unsavedChanges && (
                    <div className="p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        ⚠️ You have unsaved changes. Click Save to update your API key.
                      </p>
                    </div>
                  )}
                  
                  {!hasKey && !unsavedChanges && (
                    <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                      <p className="text-sm text-amber-800 dark:text-amber-200">
                        Add an API key to use {info.name} models
                      </p>
                    </div>
                  )}
                  
                  {hasKey && !unsavedChanges && (
                    <div className="p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <p className="text-sm text-green-800 dark:text-green-200">
                        ✓ {info.name} is enabled and ready to use
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        <div className="pt-4 border-t">
          <div className="text-xs text-muted-foreground space-y-2">
            <p><strong>Security Note:</strong> Your API keys are stored locally in your browser and are never transmitted to our servers.</p>
            <p><strong>Usage:</strong> API keys are only used to make requests to the respective AI services when you select their models.</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
