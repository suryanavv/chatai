'use client';

import { ChatProvider } from '@/hooks/use-chat-context';
import { SettingsProvider } from '@/hooks/use-settings-context';
import { Chat } from '@/components/chat';

export default function Home() {
  return (
    <SettingsProvider>
      <ChatProvider>
        {/* <div className="bg-background"> */}
            <div className="h-screen border rounded-lg bg-background">
              <Chat />
            </div>
        {/* </div> */}
      </ChatProvider>
    </SettingsProvider>
  );
}