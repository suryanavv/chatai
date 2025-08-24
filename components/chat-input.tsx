"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight, ChevronDown, Paperclip } from 'lucide-react';
import { useChatContext } from '@/hooks/use-chat-context';
import { useSettings } from '@/hooks/use-settings-context';
import { ModelProvider } from '@/lib/types';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

const providerLabels: Record<ModelProvider, string> = {
  [ModelProvider.OPENAI]: 'OpenAI',
  [ModelProvider.GOOGLE]: 'Google',
  [ModelProvider.ANTHROPIC]: 'Anthropic',
  [ModelProvider.OPENROUTER]: 'OpenRouter',
};

export default function ChatInput({
  onSendMessage,
  isLoading = false,
  placeholder = "What can I do for you?"
}: ChatInputProps) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const {
    selectedProvider,
    selectedModel,
    availableProviders,
    availableModels,
    setSelectedProvider,
    setSelectedModel,
  } = useChatContext();

  const { isProviderEnabled } = useSettings();

  const handleSubmit = () => {
    if (value.trim() && !isLoading) {
      onSendMessage(value.trim());
      setValue('');
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  return (
    <div className="w-full py-4">
      <div className="bg-black/5 dark:bg-white/5 rounded-2xl p-1.5">
        
        <div className="relative">
          <div className="relative flex flex-col">
            <div
              className="overflow-y-auto"
              style={{ maxHeight: "400px" }}
            >
              <Textarea
                id="ai-input"
                value={value}
                placeholder={placeholder}
                className={cn(
                  "w-full rounded-xl rounded-b-none px-4 py-3 bg-black/5 dark:bg-white/5 border-none dark:text-white placeholder:text-black/70 dark:placeholder:text-white/70 resize-none focus-visible:ring-0 focus-visible:ring-offset-0",
                  "min-h-[72px]"
                )}
                ref={textareaRef}
                onKeyDown={handleKeyDown}
                onChange={(e) => setValue(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="h-14 bg-black/5 dark:bg-white/5 rounded-b-xl flex items-center">
              <div className="absolute left-3 right-3 bottom-3 flex items-center justify-between w-[calc(100%-24px)]">
                <div className="flex items-center gap-2">
                  {/* Provider Selection */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="flex items-center gap-1 h-8 pl-1 pr-2 text-xs rounded-md dark:text-white hover:bg-black/10 dark:hover:bg-white/10 focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-blue-500"
                        disabled={!isProviderEnabled(selectedProvider)}
                      >
                        <div className="flex items-center gap-1">
                          <span className={cn(
                            "px-2 py-1 rounded text-xs font-medium",
                            !isProviderEnabled(selectedProvider) ? "opacity-50" : ""
                          )}>
                            {providerLabels[selectedProvider]}
                          </span>
                          <ChevronDown className="w-3 h-3 opacity-50" />
                        </div>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className={cn(
                        "min-w-[10rem]",
                        "border-black/10 dark:border-white/10",
                        "bg-gradient-to-b from-white via-white to-neutral-100 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-800"
                      )}
                    >
                      {availableProviders.map((provider) => {
                        const isEnabled = isProviderEnabled(provider);
                        return (
                          <DropdownMenuItem
                            key={provider}
                            onSelect={() => setSelectedProvider(provider)}
                            disabled={!isEnabled}
                            className={cn(
                              "flex items-center justify-between gap-2",
                              !isEnabled && "opacity-50 cursor-not-allowed"
                            )}
                          >
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-1 rounded text-xs font-medium">
                                {providerLabels[provider]}
                              </span>
                              {!isEnabled && (
                                <span className="text-xs text-amber-600">🔒 No API Key</span>
                              )}
                            </div>
                            {selectedProvider === provider && (
                              <span className="text-xs text-blue-500">✓</span>
                            )}
                          </DropdownMenuItem>
                        );
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  <div className="h-4 w-px bg-black/10 dark:bg-white/10 mx-0.5" />
                  
                  {/* Model Selection */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="flex items-center gap-1 h-8 pl-1 pr-2 text-xs rounded-md dark:text-white hover:bg-black/10 dark:hover:bg-white/10 focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-blue-500"
                        disabled={!isProviderEnabled(selectedProvider)}
                      >
                        <div className="flex items-center gap-1">
                          <span className={cn(
                            "px-2 py-1 rounded text-xs font-medium",
                            !isProviderEnabled(selectedProvider) ? "opacity-50" : ""
                          )}>
                            {selectedModel}
                          </span>
                          <ChevronDown className="w-3 h-3 opacity-50" />
                        </div>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className={cn(
                        "min-w-[12rem]",
                        "border-black/10 dark:border-white/10",
                        "bg-gradient-to-b from-white via-white to-neutral-100 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-800"
                      )}
                    >
                      {isProviderEnabled(selectedProvider) ? (
                        availableModels.map((model) => (
                          <DropdownMenuItem
                            key={model.model}
                            onSelect={() => setSelectedModel(model.model)}
                            className="flex items-center justify-between gap-2"
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{model.name}</span>
                              {model.isFree && (
                                <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded">
                                  Free
                                </span>
                              )}
                            </div>
                            {selectedModel === model.model && (
                              <span className="text-xs text-blue-500">✓</span>
                            )}
                          </DropdownMenuItem>
                        ))
                      ) : (
                        <div className="p-2 text-sm text-muted-foreground text-center">
                          Add API key for {providerLabels[selectedProvider]} to select models
                        </div>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  <div className="h-4 w-px bg-black/10 dark:bg-white/10 mx-0.5" />
                  
                  {/* Attachment Button - hidden for now */}
                  {/*
                  <label
                    className={cn(
                      "rounded-lg p-2 bg-black/5 dark:bg-white/5 cursor-pointer",
                      "hover:bg-black/10 dark:hover:bg-white/10 focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-blue-500",
                      "text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white"
                    )}
                    aria-label="Attach file"
                  >
                    <input type="file" className="hidden" />
                    <Paperclip className="w-4 h-4 transition-colors" />
                  </label>
                  */}
                </div>
                
                {/* Send Button */}
                <button
                  type="button"
                  className={cn(
                    "rounded-lg p-2 bg-black/5 dark:bg-white/5",
                    "hover:bg-black/10 dark:hover:bg-white/10 focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-blue-500",
                    "disabled:opacity-30 disabled:cursor-not-allowed"
                  )}
                  aria-label="Send message"
                  disabled={!value.trim() || isLoading}
                  onClick={handleSubmit}
                >
                  <ArrowRight
                    className={cn(
                      "w-4 h-4 dark:text-white transition-opacity duration-200",
                      value.trim() && !isLoading ? "opacity-100" : "opacity-30"
                    )}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
