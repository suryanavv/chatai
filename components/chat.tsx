'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useChatContext } from '@/hooks/use-chat-context';
import { useSettings } from '@/hooks/use-settings-context';
import { ChatMessage } from './chat-message';
import ChatInput from './chat-input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings } from './settings';
import { Settings as SettingsIcon } from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  parts: Array<{
    type: 'text';
    text: string;
  }>;
}

export const Chat: React.FC = () => {
  const { selectedProvider, selectedModel } = useChatContext();
  const { apiKeys } = useSettings();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (message: string) => {
    if (!apiKeys[selectedProvider]) {
      alert('Please add an API key for the selected provider in settings.');
      return;
    }
    
    // Add user message to chat
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date(),
      parts: [{ type: 'text', text: message }],
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      // Send message to our API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: message }],
          provider: selectedProvider,
          model: selectedModel,
          apiKeys: apiKeys,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      let assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
        timestamp: new Date(),
        parts: [],
      };

      let isFirstChunk = true;

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = new TextDecoder().decode(value);
          const lines = chunk.split('\n');
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') break;
              
              try {
                const parsed = JSON.parse(data);
                
                // Handle text deltas (the actual response text)
                if (parsed.type === 'text-delta' && parsed.delta) {
                  if (isFirstChunk) {
                    // First chunk - add the message to the UI and hide typing animation
                    assistantMessage.content = parsed.delta;
                    assistantMessage.parts = [{ type: 'text', text: parsed.delta }];
                    setMessages(prev => [...prev, assistantMessage]);
                    setIsLoading(false); // Hide typing animation
                    isFirstChunk = false;
                  } else {
                    // Update the existing message with new content
                    assistantMessage.content += parsed.delta;
                    assistantMessage.parts = [{ type: 'text', text: assistantMessage.content }];
                    
                    setMessages(prev => prev.map(msg => 
                      msg.id === assistantMessage.id 
                        ? { ...msg, content: assistantMessage.content, parts: assistantMessage.parts }
                        : msg
                    ));
                  }
                }
              } catch (e) {
                // Ignore parsing errors for partial chunks
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }

    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      {/* Chat Header */}
      <div className="p-4 border-b bg-background">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">AI Chat Assistant</h1>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => setShowSettings(true)}>
              <SettingsIcon className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </div>

      {/* Settings Dialog */}
      {showSettings && (
        <Settings open={showSettings} onOpenChange={setShowSettings} />
      )}

      {/* Messages Area */}
      <ScrollArea ref={scrollRef} className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-muted-foreground">
                    Start a conversation
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Choose your AI model above and start chatting!
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))
          )}
          
          {isLoading && (
            <div className="flex justify-start mb-4">
              <div className="flex items-start space-x-3 max-w-[80%]">
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                  <div className="w-4 h-4 text-white">🤖</div>
                </div>
                <Card className="bg-muted">
                  <CardContent className="p-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Chat Input */}
      <ChatInput
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        placeholder="Type your message here..."
      />
    </div>
  );
};
