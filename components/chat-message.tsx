'use client';

import React from 'react';
import { UIMessage } from 'ai';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bot, User } from 'lucide-react';

interface ChatMessageProps {
  message: UIMessage;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex items-start space-x-3 max-w-[80%] ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
        <Avatar className="w-8 h-8">
          <AvatarImage src={isUser ? undefined : '/bot-avatar.png'} />
          <AvatarFallback className={isUser ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'}>
            {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
          </AvatarFallback>
        </Avatar>
        
        <Card className={`${isUser ? 'bg-blue-500 text-white' : 'bg-muted'}`}>
          <CardContent className="p-3">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Badge variant={isUser ? 'secondary' : 'default'} className="text-xs">
                  {isUser ? 'You' : 'AI Assistant'}
                </Badge>
              </div>
              
              <div className="whitespace-pre-wrap text-sm">
                {message.parts.map((part, i) => {
                  switch (part.type) {
                    case 'text':
                      return (
                        <span key={`${message.id}-${i}`} className="leading-relaxed">
                          {part.text}
                        </span>
                      );
                    default:
                      return null;
                  }
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
