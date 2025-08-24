'use client';

import { ChatProvider } from '@/hooks/use-chat-context';
import { SettingsProvider } from '@/hooks/use-settings-context';
import { ModelSelector } from '@/components/model-selector';
import { Chat } from '@/components/chat';

export default function Home() {
  return (
    <SettingsProvider>
      <ChatProvider>
        <div className="min-h-screen bg-background">
          <div className="container mx-auto py-6 px-4">
            <ModelSelector />
            <div className="h-[600px] border rounded-lg bg-background">
              <Chat />
            </div>
          </div>
        </div>
      </ChatProvider>
    </SettingsProvider>
  );
}